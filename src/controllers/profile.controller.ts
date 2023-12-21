import { NextFunction, Request, Response } from "express";
import { ProfileService } from "@services/profile.service";
import { CustomRequest } from "@interfaces/CustomRequest";
import { HttpException } from "@exceptions/HttpException";
import { UserModel } from "@models/user.model";
import ExperienceService from "@services/experience.service";
import EducationService from "@services/education.service";
import AddressService from "@services/address.service";
import SkillService from "@services/skills.service";

class ProfileController {
	private profileService = new ProfileService();
	private experienceService = new ExperienceService();
	private educationService = new EducationService();
	private addressService = new AddressService();
	private skillService = new SkillService();

	public getProfileById = async (
		req: CustomRequest,
		res: Response,
		next: NextFunction,
	): Promise<void> => {
		const id = Number(req.params.id);
		const userId= Number(req.user.id)

		try {
			const profile = await this.profileService.getProfileById(id);

			if (profile) {
				res.status(200).json(profile);
			} else {
				next(new HttpException(404, "Profile not found"));
			}
		} catch (error) {
			next(error);
		}
	};

	public getProfileByUserId = async (
		req: CustomRequest,
		res: Response,
		next: NextFunction,
	): Promise<void> => {

		const userId = Number(req.user.id);

		try {
			const profile = await this.profileService.getProfileByUserId(userId);

			res.status(200).json(profile);
		} catch (error) {
			next(error);
		}
	};

	public getAllProfiles = async (
		req: CustomRequest,
		res: Response,
		next: NextFunction,
	): Promise<void> => {
		try {
			const userId = req.user.id;
			const filters = req.query;
			const profiles = await this.profileService.getAllProfiles(filters,userId);
			// if (profiles.length === 0 || !profiles) {
			// 	next(new HttpException(404, 'Alumni not found'))
			// }
			res.status(200).json(profiles);
		} catch (error) {
			next(error);
		}
	};

	public createProfile = async (
		req: CustomRequest,
		res: Response,
		next: NextFunction,
	): Promise<void> => {
		const userName = req.user.name;
		const userId = Number(req.user.id);
		const profile = req.body;
		try {
			const newProfile = await this.profileService.createProfile(
				profile,
				userId,
				userName
			);
			res.status(201).json(newProfile);
		} catch (error) {
			next(error);
		}
	};

	// Experience features
	public updateExperience = async (
		req: CustomRequest,
		res: Response,
		next: NextFunction,
	): Promise<void> => {
		const experienceId = Number(req.params.id);
		const userId = Number(req.user.id)
		const updatedData = req.body;
		try {
			const updateResponse =
				await this.experienceService.updateExperience(
					userId,
					experienceId,
					updatedData,
				);

			res.status(201).json(updateResponse);
		} catch (error) {
			next(error);
		}
	};

	public createExperience = async (
		req: CustomRequest,
		res: Response,
		next: NextFunction,
	): Promise<void> => {
		const experienceData = req.body;
		const userId = Number(req.user.id)
		try {
			const newExperience =
				await this.experienceService.createExperience(userId, experienceData);

			res.status(201).json(newExperience);
		} catch (error) {
			next(error);
		}
	};

	public deleteExperience = async (
		req: CustomRequest,
		res: Response,
		next: NextFunction,
	): Promise<void> => {
		const userId = Number(req.user.id);
		const experienceId = Number(req.params.id);
		try {
			const deletedExperience =
				await this.experienceService.deleteExperience(userId, experienceId);
			res.status(201).json(deletedExperience);
		} catch (error) {
			next(error);
		}
	};

	// address features

	public updateEducation = async (
		req: CustomRequest,
		res: Response,
		next: NextFunction,
	): Promise<void> => {
		const userId = Number(req.user.id);
		const educationId = Number(req.params.id);
		const updatedData = req.body;
		try {
			const updateResponse = await this.educationService.updateEducation(
				userId,
				educationId,
				updatedData,
			);

			res.status(201).json(updateResponse);
		} catch (error) {
			next(error);
		}
	};

	public createEducation = async (
		req: CustomRequest,
		res: Response,
		next: NextFunction,
	): Promise<void> => {
		const userId = Number(req.user.id);
		const educationData = req.body;
		try {
			const newEducation =
				await this.educationService.createEducation(userId, educationData);
			res.status(201).json(newEducation);
		} catch (error) {
			next(error);
		}
	};

	public deleteEducation = async (
		req: CustomRequest,
		res: Response,
		next: NextFunction,
	): Promise<void> => {
		const userId = Number(req.user.id);
		const educationId = Number(req.params.id);
		try {
			const deletedEducation =
				await this.educationService.deleteEducation(userId, educationId);
			res.status(201).json(deletedEducation);
		} catch (error) {
			next(error);
		}
	};

	// education features

	public updateAddress = async (
		req: CustomRequest,
		res: Response,
		next: NextFunction,
	): Promise<void> => {
		const userId = Number(req.user.id);
		const addressId = Number(req.params.id);
		const updatedData = req.body;
		try {
			const updateResponse = await this.addressService.updateAddress(
				userId,
				addressId,
				updatedData,
			);

			res.status(201).json(updateResponse);
		} catch (error) {
			next(error);
		}
	};

	public createAddress = async (
		req: CustomRequest,
		res: Response,
		next: NextFunction,
	): Promise<void> => {
		const userId = Number(req.user.id);
		const addressData = req.body;
		try {
			const newAddress =
				await this.addressService.createAddress(userId, addressData);
			res.status(201).json(newAddress);
		} catch (error) {
			next(error);
		}
	};

	public deleteAddress = async (
		req: CustomRequest,
		res: Response,
		next: NextFunction,
	): Promise<void> => {
		const userId = Number(req.user.id);
		const addressId = Number(req.params.id);
		try {
			const deletedResponse =
				await this.addressService.deleteAddress(userId, addressId);
			res.status(201).json(deletedResponse);
		} catch (error) {
			next(error);
		}
	};

	// address feature

	public updateSkill = async (
		req: CustomRequest,
		res: Response,
		next: NextFunction,
	): Promise<void> => {
		const userId = Number(req.user.id);
		const skillId = Number(req.params.id);
		const updatedData = req.body;
		try {
			const updateResponse = await this.skillService.updateSkill(
				userId,
				skillId,
				updatedData,
			);

			res.status(201).json(updateResponse);
		} catch (error) {
			next(error);
		}
	};

	public createSkill = async (
		req: CustomRequest,
		res: Response,
		next: NextFunction,
	): Promise<void> => {
		const userId = Number(req.user.id)
		const skillData = req.body;

		try {
			const newSkill = await this.skillService.createSkill(userId, skillData);
			res.status(201).json(newSkill);
		} catch (error) {
			next(error);
		}
	};

	public deleteSkill = async (
		req: CustomRequest,
		res: Response,
		next: NextFunction,
	): Promise<void> => {
		const userId = Number(req.user.id);
		const skillId = Number(req.params.id);
		try {
			const deletedSkill = await this.skillService.deleteSkill(userId, skillId);
			res.status(201).json(deletedSkill);
		} catch (error) {
			next(error);
		}
	};

	public updateProfile = async (
		req: CustomRequest,
		res: Response,
		next: NextFunction,
	): Promise<void> => {
		const userId = Number(req.user.id);
		const profileId = Number(req.params.id);
		const { updatedProfile, updatedUser } = req.body;
		try {
			const user = await UserModel.findByPk(userId);
			const profile = await this.profileService.getProfileById(profileId);

			if (!profile) {
				next(new HttpException(404, "Profile not found"));
			}
			if (!user) {
				next(new HttpException(404, "User  not found"));
			}

			const updatedProfileResponse =
				await this.profileService.updateProfile(
					profileId,
					updatedProfile,
				);

			const updatedUserResponse = await this.profileService.updateUser(
				userId,
				updatedUser,
			);

			res.status(201).json({
				message: "profile updated successfully",
				updatedProfileResponse,
				updatedUserResponse,
			});
		} catch (error) {
			next(error);
		}
	};
}

export { ProfileController };
