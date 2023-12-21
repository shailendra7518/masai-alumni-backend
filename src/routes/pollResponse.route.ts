import { Router } from "express";
import { Routes } from "@interfaces/routes.interface";
import { PollResponseController } from "@controllers/pollResponse.controller";
import { ensureAuth } from "@middlewares/auth.middleware";
class PollResponseRoute implements Routes {
	public path = "/poll-responses";
	public router = Router();
	public pollResponseController = new PollResponseController();

	constructor() {
		this.initializeRoutes();
	}

	private initializeRoutes() {
		this.router.post(
			this.path,
			ensureAuth,
			this.pollResponseController.createPollResponse,
		);
			this.router.get(
				`${this.path}/poll/:id`,
				ensureAuth,
				this.pollResponseController.getResponseByPollId,
			);
	}
}

export default PollResponseRoute;
