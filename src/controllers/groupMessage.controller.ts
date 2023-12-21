import { Request, Response, NextFunction } from 'express';
import { GroupMessageService } from '@services/groupMessage.service';
import { CustomRequest } from '@interfaces/CustomRequest';
import { getSocketServerInstance } from '@socket/socketStore';
import { GroupService } from '@services/group.service';

class GroupMessageController {
    private groupMessageService = new GroupMessageService();
    private groupService = new GroupService();

    public getAllMessages = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const groupId = +req.params.groupId
        try {
            const messages = await this.groupMessageService.getAllMessages(groupId);
            res.status(200).json(messages);
        } catch (error) {
            next(error);
        }
    };

    public createMessage = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
        const { io } = getSocketServerInstance()
        try {
            const messageData = req.body;
            const groupId = +req.params.groupId
            const authorId = +req.user.id

            const newMessage = await this.groupMessageService.createMessage({ ...messageData, authorId, messageType: "group", groupId });
            this.groupService.updateLastMessage(groupId, newMessage.id)
            io.emit('new_group_message', { message: newMessage, groupId })
            res.status(201).json(newMessage);
        } catch (error) {
            next(error);
        }
    };
}

export { GroupMessageController };
