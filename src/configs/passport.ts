import { PassportStatic } from "passport";
// import bcrypt from 'bcrypt';
import { Strategy as LocalStrategy } from "passport-local";
import { UserModel } from "@models/user.model";
import { UserAttributes } from "@interfaces/users";
import AuthUtils from "@utils/authUtils";
import { MasaiUserModel } from "@models/masaiUsersdata.model";
import { ProfileService } from "@services/profile.service";

export default function configurePassport(passport: PassportStatic) {
	passport.use(
		"local",
		new LocalStrategy(
			{
				// by default local strategy uses username and password which will be override by using email
				usernameField: "email",
				passwordField: "password",
			},
			async (email: string, password: string, done) => {
				const profileService = new ProfileService();

				try {
					const existingUser = await UserModel.findOne({
						where: { email: email },
					});

					// console.log(existingUser);
					if (existingUser) {
						const isPasswordMatch =
							await AuthUtils.comparePasswords(
								password,
								existingUser.dataValues.password,
							);
						if (isPasswordMatch) {
							delete existingUser.dataValues.password;

							// after login check if profile not found then create initial profile

							const profile =
								await profileService.getProfileByUserId(
									Number(existingUser.dataValues.id),
								);

							if (!profile) {
								await profileService.createProfile(
									{id: Number(existingUser.dataValues.id)},
									Number(existingUser.dataValues.id),
									existingUser.dataValues.name.toString(),
								);
							}

							return done(null, existingUser.dataValues);
						} else {
							return done("Incorrect password", false);
						}
					}

					const alumniUser = await MasaiUserModel.findOne({
						where: { email: email },
					});

					if (alumniUser) {
						const isPasswordMatch =
							await AuthUtils.comparePasswords(
								password,
								alumniUser.dataValues.password,
							);

						if (isPasswordMatch) {
							// If the password is correct, create a new user and return it
							let user = await UserModel.create({
								name: alumniUser.dataValues.name,
								email: alumniUser.dataValues.email,
								phone_number: alumniUser.dataValues.mobile,
								password: alumniUser.dataValues.password,
								role: alumniUser.dataValues.role,
								user_profile_photo_path:
									alumniUser.dataValues.profile_photo_path,
							});

							user = await UserModel.findByPk(user.id);

							delete user.dataValues.password;

							// check if after login user profile not found then create inital profile
							const profile =
								await profileService.getProfileByUserId(
									Number(user.id),
								);

							if (!profile) {
								await profileService.createProfile(
									{},
									Number(user.id),
									user.name.toString(),
								);
							}
							return done(null, user.dataValues);
						} else {
							return done("Incorrect password", false);
						}
					} else {
						return done("User not Found", false);
					}
				} catch (error) {
					return done("User not Found", false);
				}

				//   try {
				//     const user: UserAttributes | null = await UserModel.findOne({ where: { email } });

				//     if (!user) {
				//       return done(null, false, { message: 'Email not found' });
				//     }

				//     if (!bcrypt.compareSync(password, user.password)) {
				//       return done(null, false, { message: 'Email or password is incorrect' });
				//     }

				//     return done(null, user);
				//   } catch (error) {
				//     return done(error);
				//   }
			},
		),
	);

	passport.serializeUser(function (user: UserAttributes, done) {
		console.log("129999",user)
		done(null, user.id);
	});

	passport.deserializeUser(async function (id: string, done) {
		try {
			const user = await UserModel.findByPk(id);
			console.log("1366666",user)
			done(null, user.dataValues);
		} catch (error) {
			done(error);
		}
	});
}
