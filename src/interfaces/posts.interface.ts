import { Like } from '@interfaces/likes.interface';
import { Comment } from '@interfaces/comment.interface';

export interface attachmentType {
	fileName: string;
	fileType: string;
	fileSize: number;
	fileUrl: string;
	s3AccessKey:string;
}
export type postType = "announcement" | "post";
export interface Post {
    id: number;
    title?: string;
    content: string;
	postType:postType;
    attachments?: attachmentType[];
    created_by: number;
    likes?: Like[];
    comments?: Comment[];
}
