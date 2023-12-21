import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import PrivateMessageController from '@controllers/privateMessage.controller';
import { ensureAuth } from '@middlewares/auth.middleware';

class PrivateMessageRoute implements Routes {
    public path = '/messages';
    public router = Router();
    public privateMessageController = new PrivateMessageController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        // Get all messages between two users
        this.router.get(`${this.path}/:id`, ensureAuth, this.privateMessageController.getAllMessages);

        // Send a message to a user
        this.router.post(`${this.path}/send/:id`, ensureAuth, this.privateMessageController.sendMessage);

        // Mark all messages as seen between two users
        this.router.patch(`${this.path}/mark-as-seen/:id`, ensureAuth, this.privateMessageController.markAllMessagesAsSeen);
    }
}

export default PrivateMessageRoute;
