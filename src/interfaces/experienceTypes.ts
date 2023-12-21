export interface ExperienceAttributes {
	id: number;
	profile_id: number;
	user_id: number;
	title: string;
	designation: string;
	employment_type: string; // ex- full-time , part-time , hybrid
	company_name: string;
	industry: string;
	location: string;
	location_type: string;
	currently_working: boolean;
	start_date: Date;
	end_date?: Date;
	description?: string;
}
