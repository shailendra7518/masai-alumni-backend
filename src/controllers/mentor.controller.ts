import { NextFunction, Request, Response } from "express";
import { MentorService } from "@services/mentor.service";
import { CustomRequest } from "@interfaces/CustomRequest";
import { MentorshipRelationshipModel } from "@models/mentorshipRelationship.model";
import { HttpException } from "@exceptions/HttpException";
import { ProfileService } from "@services/profile.service";

class MentorController {
	private mentorService = new MentorService();
	private profileService = new ProfileService();

	public createMentor = async (
		req: CustomRequest,
		res: Response,
		next: NextFunction,
	): Promise<void> => {
		try {
			const userId = Number(req.user.id);
			const mentorData = req.body;

			const newMentor = await this.mentorService.createMentor(
				userId,
				mentorData,
			);
			res.status(201).json(newMentor);
		} catch (error) {
			next(error);
		}
	};

	public getMentorById = async (
		req: CustomRequest,
		res: Response,
		next: NextFunction,
	): Promise<void> => {
		try {
			const userId = Number(req.user.id);
			const mentorId = Number(req.params.id);
			const mentor = await this.mentorService.getMentorById(mentorId)
			if (!mentor) {
				next(new HttpException(404,"unable to find mentor"))
			}
			const mentorProfile = await this.profileService.getProfileByUserId(mentor.dataValues.user_id)
             if (!mentorProfile) {
					next(new HttpException(404, "unable to find mentor profile"));
				}
			
			
			res.status(201).json({mentor,mentorProfile});
		} catch (error) {
			next(error);
		}
	};

	public deleteMentor = async (
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> => {
		try {
			const mentorId = Number(req.params.id);
			const deletedRowsCount =
				await this.mentorService.deleteMentor(mentorId);

			if (deletedRowsCount === 0) {
				next(new HttpException(400, "Mentor not found"));
			} else {
				res.json({ message: "Mentor deleted successfully" });
			}
		} catch (error) {
			next(error);
		}
	};

	public getAllMentors = async (
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> => {
		try {
			const query = req.query;
			const mentors = await this.mentorService.getAllMentors(query);
			res.status(200).json(mentors);
		} catch (error) {
			next(error);
		}
	};

	public getAllMenteesForMentor = async (
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> => {
		const mentorId = Number(req.params.id);

		try {
			const menteeIds =
				await this.mentorService.getAllMenteesForMentor(mentorId);
			res.status(200).json({ menteeIds });
		} catch (error) {
			next(error);
		}
	};

	public mentorshipNotification = async (
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> => {
		const mentorId = Number(req.params.mentorId);

		try {
			const allMentorshipNotification =
				await this.mentorService.mentorshipNotification(mentorId);
			res.status(200).json(allMentorshipNotification);
		} catch (error) {
			next(error);
		}
	};

	public updateMentor = async (
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> => {
		const mentorId = Number(req.params.id);
		const updatedData = req.body;

		try {
			const [updatedRowsCount, updatedMentors] =
				await this.mentorService.updateMentor(mentorId, updatedData);
			if (updatedRowsCount === 0) {
				next(new HttpException(404, "Mentor not found"));
			} else {
				res.status(2020).json(updatedMentors);
			}
		} catch (error) {
			next(error);
		}
	};

	public acceptMentee = async (
		req: CustomRequest,
		res: Response,
		next: NextFunction,
	): Promise<void> => {
		const { mentorId, menteeId } = req.body;

		try {
			const mentorshipRelationship =
				await this.mentorService.acceptMentee(mentorId, menteeId);

			if (!mentorshipRelationship) {
				next(
					new HttpException(
						404,
						"Mentorship relationship not found or status is not pending",
					),
				);
			}

			res.status(200).json({ message: `Mentee accepted successfully` });
		} catch (error) {
			next(error);
		}
	};

	public rejectMentee = async (
		req: CustomRequest,
		res: Response,
		next: NextFunction,
	): Promise<void> => {
		const mentorId = Number(req.user.id);
		const menteeId = Number(req.params.menteeId);

		try {
			const deletedRowsCount = await MentorshipRelationshipModel.destroy({
				where: {
					mentor_id: mentorId,
					mentee_id: menteeId,
					status: "pending",
				},
			});

			if (deletedRowsCount === 0) {
				next(
					new HttpException(
						404,
						"Mentorship relationship not found or status is not pending",
					),
				);
			} else {
				res.status(200).json({
					message: `Mentee rejected successfully`,
				});
			}
		} catch (error) {
			next(error);
		}
	};

	public applyForMentorship = async (
		req: CustomRequest,
		res: Response,
		next: NextFunction,
	): Promise<void> => {
		const userId = Number(req.user.id);
		const menteeData = req.body;

		try {
			await this.mentorService.applyForMentorship({
				...menteeData,
				mentee_id: userId,
			});

			res.status(201).json({ message: "Application sent successfully" });
		} catch (error) {
			next(error);
		}
	};

	public getAcceptedMenteeCount = async (
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> => {
		const mentorId = Number(req.params.mentorId);

		try {
			const acceptedMenteeCount =
				await this.mentorService.getAcceptedMenteeCount(mentorId);
			res.status(200).json({ acceptedMenteeCount });
		} catch (error) {
			next(error);
		}
	};
}

export { MentorController };
