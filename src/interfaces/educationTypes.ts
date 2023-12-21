export interface EducationAttributes {
	id: number,
	profile_id: number,
	user_id:number,
	institution: string;
	course: string;
	field_of_study?: string;
	grade: string;
	persuing: boolean;
	description?: string;
	start_date: Date;
	end_date?: Date;
}
