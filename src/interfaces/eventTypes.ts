
export interface EventAttributes {
	id: number;
	event_title: string;
	event_description: string;
	event_type: string;
	manager_id: number;
	event_mode: string;
	event_time: string;
	event_date: Date;
	event_url: string;
	event_status: string;
	event_banner: string;
	event_speakers: string;
}

export interface eventFiltersAttributes{
	search?: string;
	event_type?:string
}