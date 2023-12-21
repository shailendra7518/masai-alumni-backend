 export interface GroupAttributes {
    id: number;
    name: string;
    description: string;
    privacy: 'public' | 'private' | 'invite-only';
    createdAt: Date;
    updatedAt: Date;
    lastMessage: number;
    membersCount: number;
    avatarURL: string;
    coverPhotoURL: string;
    admins: number[];

}

export interface GroupMembershipAttributes {
	id: number;
	groupId: number;
	userId: number;
	status: 'pending' | 'accepted' | 'rejected';
  }
