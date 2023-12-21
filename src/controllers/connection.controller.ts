import { NextFunction, Request, Response } from 'express';
import { ConnectionService } from '@services/connection.service';
import { CustomRequest } from '@interfaces/CustomRequest';
import { NotificationService } from '@services/notification.service';
import { getSocketServerInstance } from '@socket/socketStore';
import { UserModel } from '@models/user.model';
import { HttpException } from '@exceptions/HttpException';

class ConnectionController {
    private connectionService = new ConnectionService();
    private notificationService = new NotificationService();

    public getAllConnections = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
        const userId = +req.user.id
        const filters = req.query
        try {
            const connections = await this.connectionService.getAllConnections(userId, filters);

            res.status(200).json({
                success: true,
                error: false,
                connections
            });
        } catch (error) {
            next(error)
        }
    }

    public sendConnectionRequest = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
        const { user2Id } = req.params;
        const user1Id = req.user.id
        const { io } = getSocketServerInstance()
        try {
            const connection = await this.connectionService.sendConnectionRequest(Number(user1Id), Number(user2Id));
            const notification = await this.notificationService.createNotification({
                receiverId: Number(user2Id),
                type: 'connection_request_received',
                status: "delivered",
                message: 'You received a connection request.',
                authorId: Number(user1Id),
            });

            const receiver = (await UserModel.findOne({ where: { id: user2Id } })).toJSON();
            if (receiver && receiver.socket_id) {
                io.to(receiver.socket_id).emit("new-notification", { notification, connection })
            }
            res.status(201).json({
                success: true,
                error: false,
                message: 'Connection request sent',
                connection
            });
        } catch (error) {
            next(error)
        }
    }

    public acceptConnectionRequest = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
        const user2Id: number = +req.params.user2Id;
        const currentOnlineUser = req.user.id
        const { io } = getSocketServerInstance()
        try {
            const connection = await this.connectionService.acceptConnectionRequest(user2Id, currentOnlineUser);

            const notification = await this.notificationService.createNotification({
                receiverId: Number(user2Id),
                type: 'connection_request_accepted',
                status: 'delivered',
                message: 'Your connection request was accepted.',
                authorId: Number(currentOnlineUser),
            });

            const receiver = (await UserModel.findOne({ where: { id: user2Id } })).toJSON();
            if (receiver && receiver.socket_id) {
                io.to(receiver.socket_id).emit("new-notification", { notification, connection })
            }

            res.status(200).json({
                success: true,
                error: false,
                message: 'Connection request accepted',
                connection
            });
        } catch (error) {
            next(error)
        }
    }

    public rejectConnectionRequest = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
        const user2Id = +req.params.user2Id;
        const currentOnlineUser = req.user.id
        try {
            const deletedRowsCount = await this.connectionService.rejectConnectionRequest(currentOnlineUser, user2Id);
            if (deletedRowsCount === 0) {
                throw new HttpException(500, 'Unable to reject connection request')
            } else {
                res.status(200).json({
                    success: true,
                    error: false,
                    message: 'Connection request rejected'
                });
            }
        } catch (error) {
            next(error)
        }
    }
}

export default ConnectionController;
