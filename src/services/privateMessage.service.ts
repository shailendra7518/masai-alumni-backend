import { HttpException } from "@exceptions/HttpException";
import { privateMessageModel } from "@models/privateMessage.model";
import { Op } from "sequelize";

class PrivateMessageService {
    private privateMessageModel = privateMessageModel;

    public async getAllMessages(currentOnlineUserId: number, id: number, page = 1, pageSize = 20): Promise<any[]> {
        try {
            const offset = (page - 1) * pageSize;
            const messages = await this.privateMessageModel.findAll({
                where: {
                    [Op.and]: [
                        {
                            [Op.or]: [
                                { receiverId: currentOnlineUserId },
                                { authorId: currentOnlineUserId }
                            ]
                        },
                        {
                            [Op.or]: [
                                { receiverId: id },
                                { authorId: id }
                            ]
                        }
                    ]
                },
                order: [["createdAt", "DESC"]],
                limit: pageSize,
                offset: offset
            });
            return messages;
        } catch (error) {
            throw new HttpException(500, "Error fetching messages: " + error.message);
        }
    }

    public async createMessage(messageData: any): Promise<any> {
        try {
            let message = await this.privateMessageModel.create(messageData)
            message = await this.privateMessageModel.findByPk(message.id);
            return message;
        } catch (error) {
            throw new HttpException(401, "Unable to create message: " + error.message);
        }
    }

    public async markAllMessagesAsSeen(currentOnlineUserId: number, id: number): Promise<any[]> {
        try {
            await this.privateMessageModel.update(
                { status: "seen" },
                {
                    where: {
                        receiverId: currentOnlineUserId,
                        authorId: id
                    },
                }
            );

            return
        } catch (error) {
            throw new HttpException(500, "Error marking messages as seen: " + error.message);
        }
    }

}

export { PrivateMessageService };
