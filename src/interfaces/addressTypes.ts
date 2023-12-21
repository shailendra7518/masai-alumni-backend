export interface AddressAttributes {
	id: number;
	profile_id: number;
	user_id: number;
	type: string;
	street: string;
	city: string;
	state: string;
	zip: string;
	country?: string;
	building_number?: string;
	floor?: string;
}
