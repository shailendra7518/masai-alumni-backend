export type CategorieType= "Alumni Stories" | "Institute Updates" | "Alumni News" | "L-square digest";


export interface SpotlightAttributes {
    spotlight_id: number;
    spotlight_title: string;
    spotlight_description: string;
    spotlight_image: string;
    spotlight_video: string;
    Categories:CategorieType;
    created_by: number;
    related_links: string[];
}