
import { Router } from "express";
import { Routes } from "@interfaces/routes.interface";
import { ensureAuth} from "@middlewares/auth.middleware";
import awsController from "@controllers/aws.controller";

class awsRoute implements Routes {
	public path = "/signedurl";
	public router = Router();
	public awsController = new awsController();

	constructor() {
		this.initializeRoutes();
	}

	private initializeRoutes() {

		this.router.post(
			`${this.path}/single`,
			ensureAuth,
			this.awsController.preSignedUrlForSingleFile,
		);
		this.router.post(
			`${this.path}/multiple`,
			ensureAuth,
			this.awsController.preSignedUrlForMultipleFile,
		);

	}
}


export default awsRoute;
