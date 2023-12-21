import { UserAttributes } from "./users";


export interface ConnectionAttributes {
	id: number;
	user1Id: number;
	user2Id: number;
	status: 'pending' | 'accepted' | "rejected" ;
	lastMessage: number;
	User1?: UserAttributes;
	User2?: UserAttributes;
}
