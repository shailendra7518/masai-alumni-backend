import NoticeController from "@controllers/notice.controller";
import { Routes } from "@interfaces/routes.interface";
import { Router } from "express"

class NoticeRoute implements Routes {
    public path = "/notices";
    public router = Router()
    public NoticeController = new NoticeController()

    constructor() {
        this.initializeRoutes();
    }
    private initializeRoutes() {
        this.router.get(this.path, this.NoticeController.getAllNotices)
        this.router.post(this.path, this.NoticeController.createNotice)
        this.router.patch(`${this.path}/:id`, this.NoticeController.updateNotice)
        this.router.delete(`${this.path}/:id`, this.NoticeController.deleteNotice)
    }
}

export default NoticeRoute