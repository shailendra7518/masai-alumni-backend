import { Router } from "express";
import { Routes } from "@interfaces/routes.interface";
import { PollController } from "@controllers/poll.controller";
import { ensureAuth } from "@middlewares/auth.middleware";

class PollRoute implements Routes {
	public path = "/polls";
	public router = Router();
	public pollController = new PollController();
	constructor() {
		this.initializeRoutes();
	}
	private initializeRoutes() {
		
		this.router.get(
			`${this.path}/user`,
			ensureAuth,
			this.pollController.getPollsByUserId,
		);
		this.router.get(
			`${this.path}/:id`,
			ensureAuth,
			this.pollController.getPollById,
		);
		this.router.post(this.path, ensureAuth, this.pollController.createPoll);

		this.router.delete(
			`${this.path}/:id`,
			ensureAuth,
			this.pollController.deletePoll,
		);
	}
}
export default PollRoute;
