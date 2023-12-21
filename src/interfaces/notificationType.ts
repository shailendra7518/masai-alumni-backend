export interface NotificationAttributes {
	id: number;
	receiverId: number;
	type: 'connection_request_accepted' | 'connection_request_received' | "new_message";
	status: "delivered" | "seen";
	message?: string;
	linkedTo?: string;
	authorId?: number;
	linkedToId?: number
}
