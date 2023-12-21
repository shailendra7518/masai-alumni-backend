import { NextFunction, Request, Response } from 'express';
import { NotificationService } from '@services/notification.service';
import { CustomRequest } from '@interfaces/CustomRequest';
import { HttpException } from '@exceptions/HttpException';

class NotificationController {
    private notificationService = new NotificationService();

    public getAllNotifications = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
        const userId = +req.user.id
        try {
            const notifications = await this.notificationService.getAllNotifications(userId);
            res.status(200).json({
                success: true,
                error: false,
                notifications
            });
        } catch (error) {
            next(error)
        }
    };

    public createNotification = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const notificationData = req.body;
        try {
            const notification = await this.notificationService.createNotification(notificationData);
            res.status(201).json({
                success: true,
                error: false,
                message: "Notification created successfully",
                notification
            });
        } catch (error) {
            next(error)
        }
    };

    public updateNotification = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const notificationId = Number(req.params.id);
        const updatedData = req.body;
        try {
            const [updatedRowsCount, updatedNotification] = await this.notificationService.updateNotification(notificationId, updatedData);
            if (updatedRowsCount === 0) {
                next(new HttpException(404, "Notification not found"));
            } else {
                res.status(200).json({
                    success: true,
                    error: false,
                    message: "Notification updated successfully",
                    notification: updatedNotification
                });
            }
        } catch (error) {
            next(error)
        }
    };

    public deleteNotification = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const notificationId = Number(req.params.id);
        try {
            const deletedRowsCount = await this.notificationService.deleteNotification(notificationId);
            if (deletedRowsCount === 0) {
                next(new HttpException(404, "Notification not found"));
            } else {
                res.json({ message: 'Notification deleted successfully' });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };

    public markAllNotificationsAsSeen = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
        const userId = +req.user.id;
        try {
            const updatedRowsCount = await this.notificationService.markAllNotificationsAsSeen(userId);
            res.status(200).json({
                success: true,
                error: false,
                message: `${updatedRowsCount} notifications marked as seen`
            });
        } catch (error) {
            next(error)
        }
    };
}

export default NotificationController;
