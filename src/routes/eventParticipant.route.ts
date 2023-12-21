// Importing necessary modules for defining Express routes and handling HTTP requests
import { Router } from "express";
import { Routes } from "@interfaces/routes.interface";
import { EventParticipantController } from "@controllers/eventParticipant.controller";
import { ensureAuth } from "@middlewares/auth.middleware";
// EventParticipantRoute class implements the Routes interface, defining routes for event participant-related endpoints
class EventParticipantRoute implements Routes {
	public path = "/event-participants";
	public router = Router();
	public eventParticipantController = new EventParticipantController();

	// Constructor to initialize routes when an instance of EventParticipantRoute is created
	constructor() {
		this.initializeRoutes();
	}

	// Private method to set up and initialize event participant-related routes
	private initializeRoutes() {
		this.router.get(
			this.path,
			ensureAuth,
			this.eventParticipantController.getAllEventParticipants,
		);
		this.router.get(
			`${this.path}/:id`,
			ensureAuth,
			this.eventParticipantController.getEventParticipantById,
		);
			this.router.get(
				`${this.path}/event/:id`,
				ensureAuth,
				this.eventParticipantController.getEventParticipantByEventId,
			);
		this.router.post(
			this.path,
			ensureAuth,
			this.eventParticipantController.createEventParticipant,
		);
		this.router.delete(
			`${this.path}/:id`,
			ensureAuth,
			this.eventParticipantController.deleteEventParticipant,
		);
	}
}

// Exporting the EventParticipantRoute class
export default EventParticipantRoute;
