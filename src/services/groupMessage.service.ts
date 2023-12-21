import { HttpException } from "@exceptions/HttpException";
import { groupMessageModel } from "@models/groupMessage.model";
import { groupMessageAttributes } from "@interfaces/messageTypes";

class GroupMessageService {
    private groupMessageModel = groupMessageModel
    public async getAllMessages(groupId: number): Promise<groupMessageAttributes[]> {
        try {
            const messages = await this.groupMessageModel.findAll({
                where: { groupId },
                order: [['createdAt', 'DESC']],
            });
            return messages;
        } catch (error) {
            throw new HttpException(500, 'Unable to fetch messages');
        }
    }

    public async createMessage(messageData: groupMessageAttributes): Promise<groupMessageAttributes> {
        try {
            let message = await this.groupMessageModel.create(messageData);
            message = await this.groupMessageModel.findByPk(message.id);
            return message;
        } catch (error) {
            throw new HttpException(500, 'Unable to create message');
        }
    }
}

export { GroupMessageService };
