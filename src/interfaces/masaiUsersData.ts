export interface MasaiUserAttributes {
    
    name: string; // String @db.VarChar(255)
    email: string; // String @unique(map: "users_email_unique") @db.VarChar(255)
    mobile:string;
    password:string;
    role:string;
    profile_photo_path:string;
}