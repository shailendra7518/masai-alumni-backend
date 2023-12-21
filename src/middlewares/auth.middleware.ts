// import { UserRole } from 'types';
import { NextFunction, Response } from 'express';
import {CustomRequest} from "../interfaces/CustomRequest"

// export async function ensureAdminAuth(req: UserRequest, res: Response, next: NextFunction) {
// 	if (req.isAuthenticated()) {
// 		if ([UserRole.SUPER_ADMIN, UserRole.ADMIN].includes(req.user.role)) {
// 			return next();
// 		}
// 		return res.status(401).send({ message: 'User not authorized', error: true });
// 	}
// 	return res.status(401).send({ message: 'User not authorized', error: true });
// }

export async function ensureAuth(req: CustomRequest, res: Response, next: NextFunction) {
	if (req.isAuthenticated()) {
		return next();
	}
	return res.status(401).send({ message: 'User not authorized', error: true });
}
