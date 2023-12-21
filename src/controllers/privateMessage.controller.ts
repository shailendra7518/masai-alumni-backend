// // oneOnOneMessaging.ts
// import { Server, Socket } from 'socket.io';

// class OneOnOneMessaging {
//   constructor(private io: Server) {
//     this.setupEventHandlers();
//   }

//   private setupEventHandlers() {
//     this.io.on('private_message', (socket: Socket) => {
//       socket.on('private_message', (data) => {
//         this.io.to(data.recipientId).emit('private_message', data.message);
//       });
//     });
//   }
// }

// export default OneOnOneMessaging;


import { NextFunction, Response } from 'express';
import { PrivateMessageService } from '@services/privateMessage.service';
import { CustomRequest } from '@interfaces/CustomRequest';
import { UserModel } from '@models/user.model';
import { getSocketServerInstance } from '@socket/socketStore';
import { NotificationService } from '@services/notification.service';
import { ConnectionService } from '@services/connection.service';
import { HttpException } from '@exceptions/HttpException';

class PrivateMessageController {
  private privateMessageService = new PrivateMessageService();
  private notificationService = new NotificationService()
  private connectionService = new ConnectionService()

  public getAllMessages = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
    const currentOnlineUserId = req.user.id;
    const { id } = req.params;
    const { page, pageSize } = req.query;

    try {
      const messages = await this.privateMessageService.getAllMessages(
        currentOnlineUserId,
        +id,
        +page || 1,
        +pageSize || 20
      );

      res.status(200).json({
        success: true,
        error: false,
        messages
      });
    } catch (error) {
      next(error)
    }
  }

  public sendMessage = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
    const messageData = req.body;
    const chatId = +req.params.id
    const currentOnlineUserId = req.user.id;
    const { io } = getSocketServerInstance()
    try {
      const message = await this.privateMessageService.createMessage({
        ...messageData, receiverId: chatId, authorId: currentOnlineUserId, status: "delivered"
      });
      const receiver = await UserModel.findByPk(chatId);
      await this.connectionService.updateLastMessage(currentOnlineUserId, chatId, message.id)
      if (receiver) {
        const receiverData = receiver.toJSON();
        // console.log(receiverData)
        if (receiverData.socket_id) {
          // console.log("got the socket id", receiverData.socket_id)
          if (receiverData?.current_chat_info?.current_chat_id !== null && receiverData?.current_chat_info?.current_chat_id === currentOnlineUserId) {
            // console.log("is engaged ", receiverData.socket_id)
            io.to(receiverData.socket_id).emit("message-recieved", {
              success: true,
              error: false,
              message: 'Message successfully recieved',
              messageDetails: message
            });
          } else {
            // console.log("havent got chat id", receiverData.socket_id)

            const notification = await this.notificationService.createNotification({
              receiverId: receiverData.id,
              type: 'new_message',
              status: "delivered",
              message: 'You received a new message.',
              authorId: currentOnlineUserId,
            });
            io.to(receiverData.socket_id).emit('new_notification', { notification, message })
          }
        } else {
          // console.log("User is offline");
          await this.notificationService.createNotification({
            receiverId: receiverData.id,
            type: 'new_message',
            status: "delivered",
            message: 'You received a new message.',
            authorId: currentOnlineUserId,
          });
        }
      } else {
        next(new HttpException(404, "Receiver not found"));
      }
      res.status(201).json({
        success: true,
        error: false,
        message: 'Message created successfully',
        messageDetails: message
      });
    } catch (error) {
      next(error)
    }
  }

  public markAllMessagesAsSeen = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
    const currentOnlineUserId = req.user.id;
    const id = +req.params.id;
    const { io } = getSocketServerInstance()
    try {
      await this.privateMessageService.markAllMessagesAsSeen(currentOnlineUserId, id);
      const receiver = await UserModel.findOne({ where: { id } });
      if (receiver) {
        const receiverData = receiver.toJSON();
        if (receiverData.socket_id) {
          if (receiverData.current_chat_info.current_chat_id === currentOnlineUserId) {
            io.to(receiverData.socket_id).emit("marked-as-seen", {});
          }
        }
      }
      res.status(200).json({
        success: true,
        error: false,
        message: 'All messages marked as seen'
      });
    } catch (error) {
      next(error)
    }
  }
}

export default PrivateMessageController;
