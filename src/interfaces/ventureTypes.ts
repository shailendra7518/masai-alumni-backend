export type VentureStatus = "planning" | "active" | "inactive" | "completed" | "onHold"; // Modify status options as needed

export interface VentureAttributes {
    id: number;
    venture_owner: number;
    venture_founders: string[];
    venture_name: string;
    venture_description: string;
    website_link: string | null;
    contact_info: string[];
    Industry: string;
    founding_date: Date;
    current_status: VentureStatus;
    Socials: string[];
    financial_status: string;
    number_of_employee: number;
}
