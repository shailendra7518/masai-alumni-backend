import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import { GroupMessageController } from '@controllers/groupMessage.controller';
import { ensureAuth } from '@middlewares/auth.middleware';

class GroupMessageRoute implements Routes {
    public path = '/group-messages';
    public router = Router();
    public groupMessageController = new GroupMessageController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(this.path + '/:groupId', ensureAuth, this.groupMessageController.getAllMessages);
        this.router.post(this.path + '/:groupId', ensureAuth, this.groupMessageController.createMessage);
    }
}

export default GroupMessageRoute;
