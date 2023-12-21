import { Request } from 'express';
 import {UserAttributes} from "./users"

export interface CustomRequest extends Request {
	user: UserAttributes;
	isAuthenticated: () => boolean;
}
