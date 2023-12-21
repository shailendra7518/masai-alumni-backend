import { Router } from "express";
import { Routes } from "@interfaces/routes.interface";
import { ProfileController } from "@controllers/profile.controller";
import { ensureAuth } from "@middlewares/auth.middleware";

class ProfileRoute implements Routes {
	public path = "/profiles";
	public router = Router();
	public profileController = new ProfileController();

	constructor() {
		this.initializeRoutes();
	}

	private initializeRoutes() {
		this.router.get(
			this.path,
			ensureAuth,
			this.profileController.getAllProfiles,
		);

			this.router.get(
				`${this.path}/user`,
				ensureAuth,
				this.profileController.getProfileByUserId,
			);
		this.router.get(
			`${this.path}/:id`,
			ensureAuth,
			this.profileController.getProfileById,
		);
		this.router.post(
			this.path,
			ensureAuth,
			this.profileController.createProfile,
		);
		this.router.patch(
			`${this.path}/:id`,
			ensureAuth,
			this.profileController.updateProfile,
		);


		// Experience route
		
			this.router.post(
				`${this.path}/experience`,
				ensureAuth,
				this.profileController.createExperience,
		);
		
			this.router.patch(
				`${this.path}/experience/:id`,
				ensureAuth,
				this.profileController.updateExperience,
		);
		
			this.router.delete(
				`${this.path}/experience/:id`,
				ensureAuth,
				this.profileController.deleteExperience,
		);
		
		// education route
        
			this.router.post(
				`${this.path}/education`,
				ensureAuth,
				this.profileController.createEducation,
		);


		this.router.patch(
			`${this.path}/education/:id`,
			ensureAuth,
			this.profileController.updateEducation,
		);

		this.router.delete(
			`${this.path}/education/:id`,
			ensureAuth,
			this.profileController.deleteEducation,
		);
		
		// address route

		this.router.post(
			`${this.path}/address`,
			ensureAuth,
			this.profileController.createAddress,
		);

		this.router.patch(
			`${this.path}/address/:id`,
			ensureAuth,
			this.profileController.updateAddress,
		);

		this.router.delete(
			`${this.path}/address/:id`,
			ensureAuth,
			this.profileController.deleteAddress,
		);


		// skill route

			this.router.post(
				`${this.path}/skill`,
				ensureAuth,
				this.profileController.createSkill,
			);

			this.router.patch(
				`${this.path}/skill/:id`,
				ensureAuth,
				this.profileController.updateSkill,
			);

			this.router.delete(
				`${this.path}/skill/:id`,
				ensureAuth,
				this.profileController.deleteSkill,
			);

		

	}
}

export default ProfileRoute;
