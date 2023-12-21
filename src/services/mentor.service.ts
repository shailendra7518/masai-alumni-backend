// services/mentorService.ts

import { MentorModel } from "@models/mentor.model";
import { MentorAttributes } from "@interfaces/mentorTypes";
import { MentorshipRelationshipModel } from "@models/mentorshipRelationship.model";

import { FindOptions, Op } from "sequelize";
import { UserModel } from "@models/user.model";

import { FeedbackModel } from "@models/feedback.model";
import { HttpException } from "@exceptions/HttpException";

class MentorService {
	public createMentor = async (
		userId: number,
		mentorData: Partial<MentorAttributes>,
	): Promise<MentorModel> => {
		try {
			const existingMentor = await MentorModel.findOne({
				where: { user_id: userId },
			});

			if (existingMentor) {
				throw new HttpException(
					400,
					"User is already registered as a mentor.",
				);
			}

			const newMentor = await MentorModel.create({
				...mentorData,
				user_id: userId,
			});
			return newMentor;
		} catch (error) {
			throw new HttpException(
				500,
				"Unable to create mentor. Please check your input data.",
			);
		}
	};

	public getMentorById = async (
		mentorId: number
	): Promise<MentorModel> => {
		try {
			const mentor = await MentorModel.findByPk(mentorId);

			if (!mentor) {
				throw new HttpException(
					404,
					"mentor not found.",
				);
			}
			return mentor;
		} catch (error) {
			throw new HttpException(
				500,
				"Unable to create mentor. Please check your input data.",
			);
		}
	};

	public deleteMentor = async (mentorId: number): Promise<number> => {
		try {
			const deletedRowsCount = await MentorModel.destroy({
				where: { id: mentorId },
			});
			return deletedRowsCount;
		} catch (error) {
			throw new HttpException(500, "Unable to delete mentor");
		}
	};

	public getAllMentors = async (filters: any): Promise<MentorModel[]> => {
		const filterOptions: FindOptions = {};
		try {
			filterOptions.where = { is_active: true };

			if (filters.expertise) {
				filterOptions.where = {
					...(filterOptions.where || {}),
					expertise: {
						[Op.like]: `%${filters.expertise}%`,
					},
				};
			}

			if (filters.experienceYears) {
				filterOptions.where = {
					...filterOptions.where,
					experience_years: {
						[Op.overlap]: [filters.experienceYears],
					},
				};
			}

			if (filters.name) {
				filterOptions.where = {
					...(filterOptions.where || {}),
					"$user.name$": {
						[Op.regexp]: `.*${filters.name}.*`,
					},
				};
			}

			const mentors = await MentorModel.findAll({
				...filterOptions,
				include: [
					{
						as: "user",
						model: UserModel,
					},
					{
						as: "feedbacks",
						model: FeedbackModel,
					},
				],
			});

			return mentors;
		} catch (error) {
			throw new HttpException(500, "Unable to fetch mentors");
		}
	};

	public updateMentor = async (
		mentorId: number,
		updatedData: Partial<MentorAttributes>,
	): Promise<[number, MentorModel[]]> => {
		try {
			const [updatedRowsCount, updatedMentors] = await MentorModel.update(
				updatedData,
				{
					where: { id: mentorId },
					returning: true,
				},
			);
			return [updatedRowsCount, updatedMentors];
		} catch (error) {
			throw new HttpException(500, "Unable to update mentor");
		}
	};

	// Get all mentees for a mentor
	public getAllMenteesForMentor = async (
		mentorId: number,
	): Promise<number[]> => {
		try {
			const mentorshipRelationships =
				await MentorshipRelationshipModel.findAll({
					where: {
						mentor_id: mentorId,
						status: "accepted",
					},
				});

			const menteeIds = mentorshipRelationships.map(
				(relationship) => relationship.mentee_id,
			);

			return menteeIds;
		} catch (error) {
			throw new HttpException(
				500,
				"Unable to get all mentees for mentor",
			);
		}
	};

	public acceptMentee = async (
		mentorId: number,
		menteeId: number,
	): Promise<MentorshipRelationshipModel[]> => {
		try {
			const mentorshipRelationship =
				await MentorshipRelationshipModel.findOne({
					where: {
						mentor_id: mentorId,
						mentee_id: menteeId,
						status: "pending",
					},
				});

			if (!mentorshipRelationship) {
				throw new HttpException(
					404,
					"Mentorship relationship not found or status is not pending",
				);
			}

			mentorshipRelationship.status = "accepted";

			await mentorshipRelationship.save();

			const acceptedMentee = await MentorshipRelationshipModel.findAll({
				where: {
					mentor_id: mentorId,
					status: "accepted",
				},
			});

			return acceptedMentee;
		} catch (error) {
			throw new HttpException(
				500,
				`Unable to accept or reject mentee: ${error.message}`,
			);
		}
	};

	public rejectMentee = async (
		mentorId: number,
		menteeId: number,
	): Promise<number> => {
		try {
			const deletedRowsCount = await MentorshipRelationshipModel.destroy({
				where: {
					mentor_id: mentorId,
					mentee_id: menteeId,
					status: "pending",
				},
			});

			if (deletedRowsCount === 0) {
				throw new HttpException(
					404,
					"Mentorship relationship not found or status is not pending",
				);
			}

			return deletedRowsCount;
		} catch (error) {
			throw new HttpException(
				500,
				`Unable to accept or reject mentee: ${error.message}`,
			);
		}
	};

	// Apply for mentorship
	public applyForMentorship = async (menteeData): Promise<any> => {
		try {
			//    const menteeData = await MenteeModel.findByPk(menteeId);
			const existingRelationship =
				await MentorshipRelationshipModel.findOne({
					where: {
						mentee_id: menteeData.mentee_id,
						mentor_id: menteeData.mentor_id,
					},
				});

			if (existingRelationship) {
				throw new HttpException(
					400,
					"Mentorship relationship already exists",
				);
			}

			const relation =
				await MentorshipRelationshipModel.create(menteeData);
			return relation;
		} catch (error) {
			throw new HttpException(
				500,
				`Unable to apply for mentorship: ${error.message}`,
			);
		}
	};

	public mentorshipNotification = async (
		mentorId: number,
	): Promise<MentorshipRelationshipModel[]> => {
		try {
			const pendingMentorship = await MentorshipRelationshipModel.findAll(
				{
					where: {
						mentor_id: mentorId,
						status: "pending",
					},
				},
			);

			return pendingMentorship;
		} catch (error) {
			throw new HttpException(500, "Error fething pending mentorship");
		}
	};

	public getAcceptedMenteeCount = async (
		mentorId: number,
	): Promise<number> => {
		try {
			const acceptedMenteeCount = await MentorshipRelationshipModel.count(
				{
					where: {
						mentor_id: mentorId,
						status: "accepted",
					},
				},
			);

			return acceptedMenteeCount;
		} catch (error) {
			throw new HttpException(
				500,
				`Unable to get accepted mentee count: ${error.message}`,
			);
		}
	};
}

export { MentorService };
