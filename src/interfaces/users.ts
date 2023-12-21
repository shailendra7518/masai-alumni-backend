export interface UserAttributes {
    id: number; // INT PRIMARY KEY
    name: string; // VARCHAR(255)
    email: string; // VARCHAR(255)
    phone_number: string; // VARCHAR(15) or appropriate length
    password: string;
    role: string; // VARCHAR(10) or appropriate length
    user_profile_photo_path: string;
    resetToken: string;
    resetTokenExpiration: Date;
    socket_id: string;
    isOnline: boolean;
    current_chat_info: {
        current_chat_id: number;
        type: "private" | "group"
    }
}
