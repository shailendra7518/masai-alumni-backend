import { Router } from "express";
import { Routes } from "@interfaces/routes.interface";
import { ProfileController } from "@controllers/profile.controller";
import { ensureAuth } from "@middlewares/auth.middleware";

class AlumniRoute implements Routes {
	public path = "/alumni";
	public router = Router();
	public profileController = new ProfileController();
	constructor() {
		this.initializeRoutes();
	}
	private initializeRoutes() {
		this.router.get(
			`${this.path}/directory`,
			ensureAuth,
			this.profileController.getAllProfiles,
		);
		// this.router.get(
		// 	`${this.path}/:id`,
		// 	ensureAuth,
		// 	this.pollController.getPollById,
		// );
		// this.router.post(this.path, ensureAuth, this.pollController.createPoll);

		// this.router.delete(
		// 	`${this.path}/:id`,
		// 	ensureAuth,
		// 	this.pollController.deletePoll,
		// );
	}
}
export default AlumniRoute;
