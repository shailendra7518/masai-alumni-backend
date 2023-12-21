import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import { GroupController } from '@controllers/group.controller';
import { ensureAuth } from '@middlewares/auth.middleware';

class GroupRoute implements Routes {
    public path = '/group';
    public router = Router();
    public groupController = new GroupController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {

        this.router.post(this.path, ensureAuth, this.groupController.createGroup);

        this.router.put(`${this.path}/:id`, this.groupController.editGroup);

        this.router.post(`${this.path}/addUsers`, this.groupController.addUserToGroup);

        this.router.delete(`${this.path}/:id`, this.groupController.deleteGroup);

        this.router.post(`${this.path}/:id`, this.groupController.removeUserFromGroupByAdmin);

        this.router.post(`${this.path}/leaveGroup/:id`, this.groupController.leaveGroup);

        this.router.post(`${this.path}/makeAdmin/:id`, this.groupController.makeAdmin);

        this.router.post(`${this.path}/removeAdmin/:id`, this.groupController.removeAdmin);

    }
}

export default GroupRoute;
