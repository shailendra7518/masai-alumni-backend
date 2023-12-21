import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
// import UserController from '@controllers/user.controller';
// import { verifyToken } from '@middlewares/auth.middleware';
import AuthController from '@controllers/auth.controller';
import UserController from '@controllers/user.controller';
import { ensureAuth } from '@middlewares/auth.middleware';

class UserRoute implements Routes {
    public path = '/users';
    public router = Router();
    public userController = new UserController();
	public authController  = new AuthController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {

        this.router.post(`${this.path}/login`, this.authController.login);
        this.router.get(`${this.path}/logout`, this.authController.signout);
        this.router.get(`${this.path}/me`,ensureAuth,this.userController.getUserDetails);

        this.router.post(`${this.path}/forgotPassword`, this.userController.forgotPassword);

        this.router.post(`${this.path}/resetPassword`, this.userController.resetPassword);

        this.router.post(`${this.path}/changePassword`,ensureAuth, this.userController.changePassword);

    }
}

export default UserRoute;
