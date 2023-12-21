import { Server, Socket } from 'socket.io';
import { Express } from 'express';
import env from '@configs/env';
import { HttpException } from '@exceptions/HttpException';
import { UserModel } from '@models/user.model';

export default function configureSocketAuth(app: Express, io: Server) {
	io.use(async (socket: Socket, next) => {
		const cookieString = socket.request.headers.cookie || '';
		const cookies = cookieString.split(';').reduce((cookies: any, cookie) => {
			const [name, value] = cookie.trim().split('=');
			cookies[name] = value;
			return cookies;
		}, {});
		console.log(cookies)
		if (cookies[`${env.AUTH_COOKIE_NAME}`]) {

			const sessionParser = app.get('sessionMiddleware'); // Access the session middleware

			sessionParser(socket.request, {} as any, async () => {
				const userId = socket.request.session?.passport?.user;

				if (!userId) {
					const error = new HttpException(404, "User not authenticated")
					return next(error);
				}

				const user = await UserModel.findByPk(userId);

				if (!user) {
					const error = new HttpException(404, "Not authorized : User not found")
					return next(error);
				}
				socket.handshake.auth.user = user.dataValues;
				return next();
			});
		} else {
			const error = new HttpException(404, "Not authorized")
			return next(error);
		}
	});
}
