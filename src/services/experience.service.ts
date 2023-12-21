import { HttpException } from "@exceptions/HttpException";
import { ExperienceModel } from "../models/experience.model";
import { ExperienceAttributes } from "./../interfaces/experienceTypes";
import { ProfileModel } from "@models/profile.model";

class ExperienceService {
	// Create a new experience record
	private experienceModel = ExperienceModel;
	private profileModel = ProfileModel;

	public createExperience = async (
		userId: number,
		experienceData: ExperienceAttributes,
	): Promise<ExperienceModel> => {
		try {
			const newExperience = await ExperienceModel.create({
				...experienceData,
				user_id: userId,
			});

			const experiences = await this.experienceModel.findAll({
				where: { user_id: userId },
			});

			if (experiences && experiences.length > 0) {
				const experience = experiences.filter((e) => {
					e = e.toJSON();
					return e.currently_working === true;
				});

				if (experience.length > 0) {
					await this.profileModel.update(
						{
							current_designation:
								experience[0].dataValues.designation,
							current_company:
								experience[0].dataValues.company_name,
						},
						{ where: { user_id: userId } },
					);
				}
			} else {
				throw new HttpException(
					404,
					"experience record not found after creating",
				);
			}

			return newExperience;
		} catch (error) {
			throw new HttpException(500, "Error creating experience record");
		}
	};

	// Update an existing experience record
	public updateExperience = async (
		userId: number,
		experienceId: number,
		updatedExperienceData: ExperienceAttributes,
	): Promise<ExperienceModel> => {
		try {
			const experience = await ExperienceModel.findOne({
				where: { id: experienceId, user_id: userId },
			});

			if (experience) {
				experience.set(updatedExperienceData);
				await experience.save();

				const experiences = await this.experienceModel.findAll({
					where: { user_id: userId },
				});

				if (experiences && experiences.length > 0) {
					const experience = experiences.filter((e) => {
						e = e.toJSON();
						return e.currently_working === true;
					});

					if (experience.length > 0) {
						await this.profileModel.update(
							{
								current_designation:
									experience[0].dataValues.designation,
								current_company:
									experience[0].dataValues.company_name,
							},
							{ where: { user_id: userId } },
						);
					}
				} else {
					throw new HttpException(
						404,
						"experience record not found after creating",
					);
				}

				return experience;
			} else {
				return null;
			}
		} catch (error) {
			throw new HttpException(500, "Error updating experience record");
		}
	};

	// Delete an experience record
	public deleteExperience = async (
		userId: number,
		experienceId: number,
	): Promise<number> => {
		try {
			const deletedRowsCount = await ExperienceModel.destroy({
				where: { id: experienceId, user_id: userId },
			});

			const experiences = await this.experienceModel.findAll({
				where: { user_id: userId },
			});

			if (experiences && experiences.length > 0) {
				const experience = experiences.filter((e) => {
					e = e.toJSON();
					return e.currently_working === true;
				});

				if (experience.length > 0) {
					await this.profileModel.update(
						{
							current_designation:
								experience[0].dataValues.designation,
							current_company:
								experience[0].dataValues.company_name,
						},
						{ where: { user_id: userId } },
					);
				}
			} 
			// else {
			// 	throw new HttpException(
			// 		404,
			// 		"experience record not found after creating",
			// 	);
			// }

			return deletedRowsCount;
		} catch (error) {
			throw new HttpException(500, "Error deleting experience record");
		}
	};
}

export default ExperienceService;
