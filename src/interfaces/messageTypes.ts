

export interface attachmentType {
	fileName: string;
	fileType: string;
	fileSize: number;
	fileUrl: string;
	s3AccessKey:string;
}

export interface PrivateMessageAttributes {
	id: number;
	authorId: number;
	messageType: "private";
	receiverId: number;
	content: string;
	status: "delivered" | "seen";
	attachments?: attachmentType[];
  }
export interface groupMessageAttributes {
	id: number;
	authorId: number;
	messageType: "group";
	groupId: number;
	content: string;
	attachments?: attachmentType[];
  }


