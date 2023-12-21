export type workType= "Full-Time" | "Part-Time" | "Internship";
export type workMode = "Onsite" | "Remote" | "Hybrid";



export interface Contacts {
	phone: string;
	email: string;
	link: string;
}

export interface RequiredExperience {
	min: number;
	max: number;
}

export interface SalaryRange {
	min: number;
	max: number;
}


export interface JobAttributes {
	id: number;
	publisher_id: number;
	title: string;
	company_name: string;
	description: string;
	company_address: string;
	application_deadline: Date;
	isopen: boolean;
	contacts: string;
	required_exp: string;
	working_mode: workMode;
	work_type: workType;
	positions: number;
	skills: string;
	salary: string;
	website_link: string;
}
export interface JobFilters {
	query?:string;
	description?: string;
	working_mode?: string[];
	work_type: string[];
	min_salary?: number;
	max_salary?: number;
	min_exp?: number;
	max_exp?: number;
	isOpen?: boolean;
	field?: any;
	direction?:string;
	createdAt?: string;
	page?: number;
	pageSize?:number;
	created_by_me?:boolean;
	orderBy?: {
		field: keyof JobAttributes;
		direction: 'ASC' | 'DESC';
	};
}
