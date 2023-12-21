// import env from '@configs/env';
import { NextFunction, Request, Response } from 'express';
import passport from 'passport';
import '@configs/passport';
import env from '@configs/env';



class AuthController {


	public login = async (req: Request, res: Response, next: NextFunction) => {
		passport.authenticate('local', function (err, user) {


			if (err || !user) {
				return res.json({
					message: err,
				});
			}
			req.logIn(user, function (err) {
				if (err) {
					return next(err);
				}

				return res.status(200).json({
					message: 'Sign in successful!',
					error: false,
					user: req.user
				});
			});
		})(req, res, next);
	};

	public signout = async (req: Request, res: Response, next: NextFunction) => {
		req.logout(function (err) {
			if (err) return next(err);
			res.status(200).clearCookie(env.AUTH_COOKIE_NAME, {
				domain: env.COOKIE_DOMAIN,
			});
			req.session.destroy(function (err) {
				if (err) return next(err);
				return res.status(200).send({ message: 'Logged out successfully', error: false });
			});
		});
	};


}
export default AuthController;
