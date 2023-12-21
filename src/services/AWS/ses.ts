
import env from '@configs/env';
import { getSES } from './aws.config';
import { SendEmailCommand } from '@aws-sdk/client-ses';
const ses = getSES();

export const sendEmail = async (to, subject,message, html) => {

	const body = message ? {
		Text: {
			Charset: 'UTF-8',
			Data: message,
		},
	} : html ? {
		Html: {
			Charset: "UTF-8",
			Data: html
		}
	} : {};

	const params = {
		Destination: {
			ToAddresses: [to],
		},
		Message: {
			Body: body,
			Subject: {
				Charset: 'UTF-8',
				Data: subject,
			},
		},
		Source:env.FROM_EMAIL,

	};
	try {
		const data = await ses.send(new SendEmailCommand(params));
		return data;
	}
	catch (err) {
		console.log(err)
	}
};
