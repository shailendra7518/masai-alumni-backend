import env from "@configs/env";
import { CustomRequest } from "@interfaces/CustomRequest";
import GetPresignedUrl from "@services/AWS/aws.constants";
import { getContentType } from "@utils/getContentType";
import { Response } from "express"

class awsController {

	public getPreSignedUrl = new GetPresignedUrl();

	public preSignedUrlForSingleFile = async (req: CustomRequest, res: Response) => {

		try {
			const { fileExtension, type } = req.body;

			const contentType = getContentType(req.body.fileExtension)
			const objectKey = `alumni/${type}/${Date.now()}.${fileExtension}`;

			const presignedUrl = await this.getPreSignedUrl.getPresignedUrlToUpload(objectKey, contentType);
			presignedUrl["fileUrl"] = `https://${env.AWS_BUCKET_NAME}.s3.${env.AWS_REGION}.amazonaws.com/${objectKey}`;
			res.status(200).json(presignedUrl);
		} catch (error) {
			console.error('Error initiating file upload:', error);
			res.status(500).json({ error: 'Error initiating file upload.' });
		}

	}

	public preSignedUrlForMultipleFile = async (req: CustomRequest, res: Response) => {
		try {
			const fileArray = req.body;
			const uploadFileDetail = await Promise.all(fileArray.map(async (file) => {
				const { fileExtension, type } = file;
				const contentType = getContentType(fileExtension);
				const objectKey = `alumni/${type}/${Date.now()+Math.random()}.${fileExtension}`;
				const presignedUrl = await this.getPreSignedUrl.getPresignedUrlToUpload(objectKey, contentType);
				presignedUrl["fileUrl"] = `https://${env.AWS_BUCKET_NAME}.s3.${env.AWS_REGION}.amazonaws.com/${objectKey}`;
				presignedUrl["s3AccessKey"] = objectKey;
				return presignedUrl;
			}));
			res.status(200).json(uploadFileDetail);
		} catch (error) {
			console.error('Error initiating file upload:', error);
			res.status(500).json({ error: 'Error initiating file upload.' });
		}
	}

}

export default awsController;
