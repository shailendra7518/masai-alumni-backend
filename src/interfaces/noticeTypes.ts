
export type NoticeCategory =  | "event" | "poll" | "post" | "job" | "broadcast" | "announcement";


export interface NoticeAttributes {
    id: number;
    authorId: number;
    category: NoticeCategory;
    attachmentId: number;
}
