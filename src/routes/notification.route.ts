import { Router } from "express";
import { Routes } from "@interfaces/routes.interface";
import NotificationController from "@controllers/notification.controller";
import { ensureAuth } from "@middlewares/auth.middleware";

class NotificationRoute implements Routes {
    public path = "/notifications";
    public router = Router();
    public notificationController = new NotificationController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(this.path, ensureAuth, this.notificationController.getAllNotifications);

        // Create a new notification
        this.router.post(`${this.path}/create`, ensureAuth, this.notificationController.createNotification);

        // Update a notification status (seen/unread)
        this.router.put(`${this.path}/update-status/:notificationId`, ensureAuth, this.notificationController.updateNotification);

        // Delete a notification
        this.router.delete(`${this.path}/delete/:notificationId`, ensureAuth, this.notificationController.deleteNotification);

        // Mark all notifications as seen
        this.router.put(`${this.path}/seen-all`, ensureAuth, this.notificationController.markAllNotificationsAsSeen);
    }
}

export default NotificationRoute;
