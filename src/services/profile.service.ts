import { HttpException } from "@exceptions/HttpException";
import {
	ProfileAttributes,
	ProfileFiltersAttributes,
} from "@interfaces/profileTypes";
import { ProfileModel } from "@models/profile.model";
import { UserModel } from "@models/user.model";
import { Op, FindOptions } from "sequelize";
import { UserAttributes } from "./../interfaces/users";
import { SkillAttributes } from "./../interfaces/skillTypes";
import { ExperienceAttributes } from "@interfaces/experienceTypes";
import { EducationAttributes } from "@interfaces/educationTypes";
import { AddressAttributes } from "@interfaces/addressTypes";
import { ExperienceModel } from "@models/experience.model";
import { AddressModel } from "@models/address.model";
import { SkillModel } from "@models/skills.model";
import { EducationModel } from "@models/education.model";
import { ConnectionModel } from "@models/connection.model";

class ProfileService {
	private profileModel = ProfileModel;
	private userModel = UserModel;
	private experienceModel = ExperienceModel;
	private addressModel = AddressModel;
	private skillModel = SkillModel;
	private educationModel = EducationModel;
	private connectionModel = ConnectionModel;

	public getProfileById = async (
		profileId: number,
	): Promise<any> => {
		try {
			const profile = await this.profileModel.findByPk(profileId, {
				include: [
					{
						model: this.userModel,
						as: "user_data",
						
					},
					{
						model: this.experienceModel,
						as: "experiences",
					},
					{
						model: this.educationModel,
						as: "educations",
					},
					{
						model: this.addressModel,
						as: "addresses",
					},
					{
						model: this.skillModel,
						as: "skills",
					},
				],
			});



	
		const connections = await this.connectionModel.findAll({
			where: {
				[Op.or]: [
					{
						
						user2Id: profile["user_data"]["dataValues"].id,
					},
					{
						user1Id: profile["user_data"]["dataValues"].id,
						
					},
				]
			}
		})
	



        //  return profile

			return {...profile.toJSON(),connections};
		} catch (error) {
			throw new HttpException(500, "Error fetching profile");
		}
	};

	public getProfileByUserId = async (
		userId: number,
	): Promise<ProfileModel | null> => {
		try {
			const profile = await this.profileModel.findOne({
				where: { user_id: userId },
				include: [
					{
						model: this.userModel,
						as: "user_data",
						
					},
					{
						model: this.experienceModel,
						as: "experiences",
					},
					{
						model: this.educationModel,
						as: "educations",
					},
					{
						model: this.addressModel,
						as: "addresses",
					},
					{
						model: this.skillModel,
						as: "skills",
					},
				],
			});
			return profile;
		} catch (error) {
			throw new HttpException(500, "Error fetching profile");
		}
	};

	public getAllProfiles = async (
		filters: Partial<ProfileFiltersAttributes>,
		userId: number,
	): Promise<any> => {
		try {
			const page = filters.page && filters.page > 0 ? filters.page : 1;
			const pageSize =
				filters.pageSize && filters.pageSize <= 36
					? filters.pageSize
					: 18;

			const pagination: FindOptions = {
				limit: pageSize,
				offset: (page - 1) * pageSize,
			};

			let profileFilterOptions = {};
			const skillFilterOptions = {};
			const educationFilterOptions = {};
			const addressFilterOptions = {};
			const experienceFilterOptions = {};

			//    profile section filters

			if (filters.batch) {
				const batchCondition = {
					[Op.or]: [
						{
							start_batch: { [Op.lte]: filters.batch },
							end_batch: { [Op.gte]: filters.batch },
						},
						{
							start_batch: { [Op.gte]: filters.batch },
							end_batch: { [Op.lte]: filters.batch },
						},
					],
				};

				profileFilterOptions["where"] = {
					...profileFilterOptions["where"],
					...batchCondition,
				};
			}

			if (filters.gender) {
				profileFilterOptions["where"] = {
					...profileFilterOptions["where"],
					gender: filters.gender,
				};
			}

			if (filters.roll_number) {
				profileFilterOptions["where"] = {
					...profileFilterOptions["where"],
					roll_number: {
						[Op.regexp]: `.*${filters.roll_number}.*`,
					},
				};
			}

			// experience section fitlers

			if (filters.designation) {
				experienceFilterOptions["where"] = {
					...experienceFilterOptions["where"],
					designation: { [Op.regexp]: `.*${filters.designation}.*` },
				};
			}

			if (filters.company_name) {
				experienceFilterOptions["where"] = {
					...experienceFilterOptions["where"],
					company_name: {
						[Op.regexp]: `.*${filters.company_name}.*`,
					},
				};
			}
			if (filters.workIndustry) {
				experienceFilterOptions["where"] = {
					...experienceFilterOptions["where"],
					workIndustry: {
						[Op.regexp]: `.*${filters.workIndustry}.*`,
					},
				};
			}

			// skills section filters

			if (filters.skills) {
				skillFilterOptions["where"] = {
					...skillFilterOptions["where"],
					skill_name: { [Op.regexp]: `.*${filters.skills}.*` },
				};
			}

			// education section filters

			if (filters.education) {
				educationFilterOptions["where"] = {
					...educationFilterOptions["where"],
					course: { [Op.regexp]: `.*${filters.education}.*` },
				};
			}

			// address section filters

			if (filters.city) {
				addressFilterOptions["where"] = {
					...addressFilterOptions["where"],
					city: { [Op.regexp]: `.*${filters.city}.*` },
				};
			}

			// user section filters

			if (filters.search) {
				const searchText = {
					[Op.or]: [
						{
							$user_name$: {
								[Op.regexp]: `.*${filters.search}.*`,
							},
						},
						{
							$city$: {
								[Op.regexp]: `.*${filters.search}.*`,
							},
						},
						{
							$current_designation$: {
								[Op.regexp]: `.*${filters.search}.*`,
							},
						},
						{
							$current_company$: {
								[Op.regexp]: `.*${filters.search}.*`,
							},
						},
					],
				};
				profileFilterOptions["where"] = {
					...profileFilterOptions["where"],
					...searchText,
				};
			}
			const userProfile = await ProfileModel.findOne({where:{user_id:userId}})

			if (userProfile&& userProfile.dataValues.id) {
					profileFilterOptions["where"] = {
						...profileFilterOptions["where"],
						id: {
							[Op.not]: userProfile.dataValues.id,
						},
					};
				}
			const profiles = await ProfileModel.findAll({
				...profileFilterOptions,
				...pagination,
				include: [
					{
						as: "user_data",
						model: UserModel,
						
					},
					{
						model: this.experienceModel,
						as: "experiences",
						...experienceFilterOptions,
						attributes: [
							"id",
							"title",
							"employment_type",
							"currently_working",
							"company_name",
							"designation",
						],
					},
					{
						model: this.educationModel,
						as: "educations",
						...educationFilterOptions,
						attributes: ["id", "institution", "course", "persuing"],
					},
					{
						model: this.addressModel,
						as: "addresses",
						...addressFilterOptions,
						attributes: ["id", "city", "state"],
					},
					{
						model: this.skillModel,
						as: "skills",
						...skillFilterOptions,
						attributes: ["id", "skill_name", "used_on"],
					},
				],
				attributes: [
					"id",
					"user_name",
					"city",
					"current_designation",
					"current_company",
					"links",
					"roll_number",
				],
			});


			const profilesWithConnectionStatus = await Promise.all(

				 profiles.map(async (profile) => {
					const connection = await this.connectionModel.findOne({
						where: {
							[Op.or]: [
								{
									user1Id: userId,
									user2Id:profile["user_data"]["dataValues"].id,
								},
								{
									user1Id:profile["user_data"]["dataValues"].id,
									user2Id: userId,
								},
							],
						},
					});
					return { ...profile.toJSON(), connection };
				}),
			);

			if (profiles.length === 0) {
				return [];
			}

			return profilesWithConnectionStatus;
		} catch (error) {
			throw new HttpException(500, "Error fething profile");
		}
	};
	public createProfile = async (
		profile: Partial<ProfileAttributes>,
		userId: number,
		userName: string,
	): Promise<any> => {
		try {
			let newProfile = await this.profileModel.create({
				...profile,
				user_id: userId,
				user_name: userName,
			});
			newProfile = await this.profileModel.findByPk(newProfile.id);

			return newProfile;
		} catch (error) {
			throw new HttpException(500, "Unable to create profile");
		}
	};

	public updateUser = async (
		userId: number,
		updatedUser: Partial<UserAttributes>,
	): Promise<any> => {
		try {
			const updatedUserResponse = await this.userModel.update(
				updatedUser,
				{
					where: { id: userId },
					returning: true,
				},
			);
			if (updatedUser.name) {
				await this.profileModel.update(
					{ user_name: updatedUser.name },
					{ where: { user_id: userId } },
				);
			}

			return [updatedUserResponse];
		} catch (error) {
			throw new HttpException(500, "Unable to update user");
		}
	};

	public updateProfile = async (
		profileId: number,
		updatedProfile: Partial<ProfileAttributes>,
	): Promise<any> => {
		try {
			const updatedProfileResponse = await this.profileModel.update(
				updatedProfile,
				{
					where: { id: profileId },
					returning: true,
				},
			);

			return [updatedProfileResponse];
		} catch (error) {
			throw new HttpException(500, "Unable to update profile");
		}
	};
}

export { ProfileService };
