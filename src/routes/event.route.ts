
import { Router } from "express";
import { Routes } from "@interfaces/routes.interface";
import { EventController } from "@controllers/event.controller";
import { ensureAuth} from "@middlewares/auth.middleware";

class EventRoute implements Routes {
	public path = "/events";
	public router = Router();
	public eventController = new EventController();

	constructor() {
		this.initializeRoutes();
	}

	
	private initializeRoutes() {
		this.router.get(
			this.path,
			ensureAuth,
			this.eventController.getAllEvent,
		);
		this.router.get(
			`${this.path}/:id`,
			ensureAuth,
			this.eventController.getEventById,
		);
		this.router.post(this.path,ensureAuth, this.eventController.createEvent);
		this.router.patch(
			`${this.path}/:id`,
			ensureAuth,
			this.eventController.updateEvent,
		);
		this.router.delete(
			`${this.path}/:id`,
			ensureAuth,
			this.eventController.deleteEvent,
		);
	}
}


export default EventRoute;
