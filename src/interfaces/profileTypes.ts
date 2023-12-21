export interface Interest {
	name: string;
	category: string;
	description?: string;
}


export interface Link {
	name: string;
	url: string;
}

export interface ProfileAttributes {
	id: number;
	user_id: number;
	start_date: Date;
	end_date: Date;
	start_batch: string;
	end_batch: string;
	roll_number: string;
	city: string;
	current_company: string;
	current_designation: string;
	secondary_email: string;
	secondary_contactNumber: string;
	user_name: string;
	resume: string;
	gender: string;
	about: string;
	banner: string;
	placement_date: Date;
	dropout_date?: Date;
	birth_date: Date;
	interests: Interest[];
	links: Link[]
	
}

export interface ProfileFiltersAttributes {
	search?: string;
	intrest?: string;
	batch?: string;
	education?: string;
	skills?: string;
	city?: string;
	gender?: string;
	roll_number?: string;
	designation?: string;
	company_name?: string;
	workIndustry?: string;
	page?: number;
	pageSize?: number;
}
