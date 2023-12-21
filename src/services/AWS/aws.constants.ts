import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import env from "@configs/env";
import { getS3 } from "./aws.config";


const s3Client = getS3();

class GetPresignedUrl {


	public getPresignedUrlToUpload = async (objectKey: string, contentType : string) => {

		const params = {
			Bucket: env.AWS_BUCKET_NAME,
			Key: objectKey,
			ContentType: contentType,
			// ContentDisposition: "inline"
		};

		try {
			const putCommand = new PutObjectCommand(params);
			const presignedUrl = await getSignedUrl(s3Client, putCommand, { expiresIn: 3600 });

			return { presignedUrl};
		} catch (error) {
			console.error('Error generating pre-signed URL:', error);
			throw error;
		}
	}
}

export default GetPresignedUrl;
