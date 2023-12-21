import { config } from "dotenv";
import { cleanEnv, port, str } from "envalid";
const validateEnv = () => {
	const env = config({
		path: `.env.${process.env.NODE_ENV}.local`,
	}).parsed;
	const cleanedEnv = cleanEnv(env, {
		NODE_ENV: str(),
		PORT: port(),
		OPENAI_API_KEY: str(),
		COOKIE_DOMAIN: str(),
		SESSION_SECRET: str(),
		AUTH_COOKIE_NAME: str(),
		CORS_ORIGINS: str(),
		DATABASE_NAME: str(),
		DATABASE_USERNAME: str(),
		DATABASE_PASSWORD: str(),
		DATABASE_HOST: str(),
		COOKIE_SECRET: str(),
		JWT_SECRET: str(),
		LOG_DIR: str(),
		AWS_REGION: str(),
		SES_AWS_REGION: str(),
		AWS_ACCESS_KEY_ID: str(),
		AWS_SECRET_ACCESS_KEY: str(),
		FROM_EMAIL :str(),
		AWS_BUCKET_NAME : str()

	});
	return cleanedEnv;
};

console.log("Validating env...");
const env = validateEnv();
console.log("Validated env: It's all good!");

export default env;
