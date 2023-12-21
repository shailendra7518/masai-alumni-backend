import { HttpException } from "@exceptions/HttpException";
import { ConnectionAttributes } from "@interfaces/connectionTypes";
import { ConnectionModel } from "@models/connection.model";
import { privateMessageModel } from "@models/privateMessage.model";
import { UserModel } from "@models/user.model";
import { Op } from "sequelize";

class ConnectionService {
    private connectionModel = ConnectionModel;

    public getAllConnections = async (userId: number, filters: { sentby?: string, status?: string }): Promise<any[]> => {
        let whereClause: any = {
            user1Id: userId
        };

        if (filters.sentby === "me") {
            if (filters.status === 'accepted') {
                whereClause = {
                    user1Id: userId,
                    status: 'accepted'
                };
            } else if (filters.status === 'pending') {
                whereClause = {
                    user1Id: userId,
                    status: 'pending'
                };
            }
        } else {
            if (filters.status === 'accepted') {
                whereClause = {
                    [Op.or]: [
                        {
                            user1Id: userId,
                            status: 'accepted'
                        },
                        {
                            user2Id: userId,
                            status: 'accepted'
                        }
                    ]
                };
            } else if (filters.status === 'pending') {
                whereClause = {
                    user2Id: userId,
                    status: 'pending'
                };
            }
        }

        try {
            const connections = await this.connectionModel.findAll({
                where: whereClause,
                include: [
                    {
                        as: "User1",
                        model: UserModel,
                        attributes: { exclude: ['password', 'resetToken', 'resetTokenExpiration', 'socket_id', 'current_chat_info', 'isOnline'] },
                    },
                    {
                        as: "User2",
                        model: UserModel,
                        attributes: { exclude: ['password', 'resetToken', 'resetTokenExpiration', 'socket_id', 'current_chat_info', 'isOnline'] },
                    },
                    {
                        as: "LastMessageInfo",
                        model: privateMessageModel,
                    }
                ],
                attributes: {
                    exclude: ['user1Id', 'user2Id'],
                },
                order: [['updatedAt', 'DESC']]
            });


            const connectedUsers = connections.map((connection) => {
                const user1 = connection.toJSON().User1;
                const user2 = connection.toJSON().User2;

                if (user1 && user2) {
                    return userId === connection.toJSON().user1Id ? { ...user2, status: connection.toJSON().status, lastMessage: connection.toJSON().lastMessage } : { ...user1, status: connection.toJSON().status, lastMessage: connection.toJSON().lastMessage };
                } else {
                    return null;
                }
            });

            return connectedUsers.filter((user) => user !== null);
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            } else {
                throw new HttpException(500, 'Error fetching connections');
            }
        }
    }


    public sendConnectionRequest = async (senderId: number, recieverId: number): Promise<any> => {
        try {
            if (senderId === recieverId) {
                throw new HttpException(400, "Cannot send connection request to self")
            }

            const userExists = await UserModel.findByPk(recieverId);
            if (!userExists) {
                throw new HttpException(404, 'User with user2Id does not exist')
            }

            const existingConnection = await this.connectionModel.findOne({
                where: {
                    [Op.or]: [
                        {
                            user1Id: senderId,
                            user2Id: recieverId,
                            status: 'accepted'
                        },
                        {
                            user1Id: recieverId,
                            user2Id: senderId,
                            status: 'accepted'
                        },
                        {
                            user1Id: senderId,
                            user2Id: recieverId,
                            status: 'pending'
                        },
                        {
                            user1Id: recieverId,
                            user2Id: senderId,
                            status: 'pending'
                        }
                    ]
                }
            });


            if (existingConnection) {
                throw new HttpException(404, 'Connection request already sent')
            }

            let newConnection = await this.connectionModel.create({
                user1Id: senderId,
                user2Id: recieverId,
                status: 'pending',
            });
            newConnection = await this.connectionModel.findByPk(newConnection.id);


            return newConnection
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            } else {
                throw new HttpException(500, 'Unable to send connection request');
            }
        }
    }


    public acceptConnectionRequest = async (senderId: number, user2Id: number): Promise<ConnectionAttributes> => {
        try {
            const existingConnection = await this.connectionModel.findOne({
                where: {
                    user1Id: senderId,
                    user2Id,
                    status: 'pending'
                },
                include: [
                    {
                        as: 'User1',
                        model: UserModel,
                        attributes: {
                            exclude: ['user1Id', 'user2Id', 'password', 'resetToken', 'resetTokenExpiration', 'socket_id', 'current_chat_info', 'isOnline']
                        },
                    },
                ],
               
            });

            if (!existingConnection) {
                throw new HttpException(404, 'No pending connection request found');
            }

            const data = await this.connectionModel.update(
                { status: 'accepted' },
                { where: { id: existingConnection.toJSON().id, status: 'pending' }, returning: true }
            );

            if (data[0] === 0) {
                throw new Error('Unable to accept connection request');
            }

            return { ...existingConnection.toJSON(), status: 'accepted' }
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            } else {
                throw new HttpException(500, 'Unable to accept connection request');
            }
        }
    }


    public rejectConnectionRequest = async (receiverId: number, senderId: number): Promise<number> => {
        try {
            const existingConnection = await this.connectionModel.findOne({
                where: {
                    user1Id: senderId,
                    user2Id: receiverId,
                    status: 'pending'
                }
            });
            if (!existingConnection) {
                throw new HttpException(404, 'No pending connection request found');
            }

            // Delete the rejected connection
            const deletedRowsCount = await this.connectionModel.destroy({ where: { id: existingConnection.toJSON().id } });

            return deletedRowsCount;
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            } else {
                throw new HttpException(500, 'Unable to reject connection request');
            }
        }
    }

    public updateLastMessage = async (senderId: number, recieverId: number, messageId: number): Promise<number> => {
        try {
            const existingConnection = await this.connectionModel.findOne({
                where: {
                    [Op.or]: [
                        {
                            user1Id: senderId,
                            user2Id: recieverId,
                            status: 'accepted'
                        },
                        {
                            user1Id: recieverId,
                            user2Id: senderId,
                            status: 'accepted'
                        }
                    ]
                }
            })

            if (!existingConnection) {
                throw new HttpException(404, 'no connection found');
            }
            if (existingConnection) {
                existingConnection.lastMessage = messageId;
                await existingConnection.save();
                return existingConnection.id;
            }

        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            } else {
                throw new HttpException(500, 'Unable to update last message');
            }
        }
    }


}

export { ConnectionService };
