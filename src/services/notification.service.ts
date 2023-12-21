import { HttpException } from "@exceptions/HttpException";
import { NotificationAttributes } from "@interfaces/notificationType";
import { NotificationModel } from "@models/notification.model";

class NotificationService {
    private notificationModel = NotificationModel;

    public getAllNotifications = async (id: number): Promise<any[]> => {
        try {
            const notifications = await this.notificationModel.findAll({
                where: { receiverId: id },
                order: [["createdAt", "DESC"]],
            });
            return notifications;
        } catch (error) {
            throw new HttpException(500, "Error fetching notifications: " + error.message);
        }
    };

    public createNotification = async (
        notificationData: Partial<NotificationAttributes>
    ): Promise<any> => {
        try {
            let notification = await this.notificationModel.create(notificationData)
            notification = await this.notificationModel.findByPk(notification.id)
            return notification;
        } catch (error) {
            throw new HttpException(404, "Unable to create notification: " + error.message);
        }
    };

    public updateNotification = async (
        notificationId: number,
        updatedData: Partial<NotificationAttributes>
    ): Promise<[number, NotificationModel[]]> => {
        try {
            const [updatedRowsCount, updatedNotification] = await this.notificationModel.update(updatedData, {
                where: { id: notificationId },
                returning: true,
            });
            return [updatedRowsCount, updatedNotification];
        } catch (error) {
            throw new HttpException(404, "Unable to update notification: " + error.message);
        }
    };

    public deleteNotification = async (notificationId: number): Promise<number> => {
        try {
            const deletedRowsCount = await this.notificationModel.destroy({
                where: { id: notificationId },
            });
            return deletedRowsCount;
        } catch (error) {
            throw new HttpException(404, "Unable to delete notification: " + error.message);
        }
    };

    public markAllNotificationsAsSeen = async (receiverId: number): Promise<number> => {
        try {
            const updatedRowsCount = await this.notificationModel.update(
                { status: 'seen' },
                {
                    where: { receiverId },
                }
            );
            return updatedRowsCount[0];
        } catch (error) {
            throw new Error("Unable to mark all notifications as seen: " + error.message);
        }
    };
}

export { NotificationService };
