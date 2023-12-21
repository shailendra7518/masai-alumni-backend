export enum NotificationType {
    CONNECTION_REQUEST = 'connection_request',
    CONNECTION_ACCEPTANCE = 'connection_acceptance',
    CONNECTION_REJECTION = 'connection_rejection',
    NEW_MESSAGE = 'new_message',
    CONNECTION_DELETED = 'connection_deleted',
    // PROFILE_VISIT = 'profile_visit',
    // TAGGED_IN_POST = 'tagged_in_post',
    // POST_LIKED = 'post_liked',
    // POST_COMMENTED = 'post_commented',
    // GROUP_MEMBERSHIP = 'group_membership',
}

export interface Notification {
    senderId: string;
    receiverId: string;
    type: NotificationType;
    status: 'read' | 'unread';
    createdAt: Date;
    updatedAt: Date;
}
