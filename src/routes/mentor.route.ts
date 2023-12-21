// routes/mentorRoutes.ts
import { Router } from "express";
import { MentorController } from "@controllers/mentor.controller";
import { ensureAuth } from "@middlewares/auth.middleware";

class MentorRoutes {
	public path = "/mentors";
	public router = Router();
	public mentorController = new MentorController();

	constructor() {
		this.initializeRoutes();
	}

	private initializeRoutes() {
		this.router.post(
			this.path,
			ensureAuth,
			this.mentorController.createMentor,
		);
		this.router.get(
			this.path,
			ensureAuth,
			this.mentorController.getAllMentors,
		);
		this.router.get(
			`${this.path}/:id`,
			ensureAuth,
			this.mentorController.getMentorById,
		);
		this.router.put(
			`${this.path}/:id`,
			ensureAuth,
			this.mentorController.updateMentor,
		);
		this.router.get(
			`${this.path}/:id/mentees`,
			ensureAuth,
			this.mentorController.getAllMenteesForMentor,
		);

		this.router.get(
			`${this.path}/mentees-request/:mentorId`,
			ensureAuth,
			this.mentorController.mentorshipNotification,
		);

		this.router.post(
			`${this.path}/apply-for-mentorship`,
			ensureAuth,
			this.mentorController.applyForMentorship,
		);
		this.router.get(
			`${this.path}/accepted-mentee-count/:mentorId`,
			ensureAuth,
			this.mentorController.getAcceptedMenteeCount,
		);
		this.router.delete(
			`${this.path}/:id`,
			ensureAuth,
			this.mentorController.deleteMentor,
		);
	}
}

export default MentorRoutes;
