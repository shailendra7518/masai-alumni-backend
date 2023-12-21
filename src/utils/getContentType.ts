import mime from "mime-types";

export const getContentType = (fileExtension: string): string => {

	return mime.contentType(`.${fileExtension}`);
};
