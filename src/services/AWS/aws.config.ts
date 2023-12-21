import { S3Client} from "@aws-sdk/client-s3";

import env from "@configs/env";

import { SESClient } from "@aws-sdk/client-ses";

const CONFIG = {
	credentials: {
		accessKeyId: env.AWS_ACCESS_KEY_ID,
		secretAccessKey: env.AWS_SECRET_ACCESS_KEY
	},
	region: env.AWS_REGION
};

export const getSES = () => new SESClient(CONFIG);
export const getS3 = () => new S3Client(CONFIG);


