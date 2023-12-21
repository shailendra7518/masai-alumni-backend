import { HttpException } from "@exceptions/HttpException";
import { EventAttributes, eventFiltersAttributes } from "@interfaces/eventTypes";
import { EventModel } from "@models/event.model";
import { EventParticipantModel } from "@models/eventParticipant.model";
import { UserModel } from "@models/user.model";
import { Op } from "sequelize";

class EventService {
	private eventModel = EventModel;
	private eventParticipantModel = EventParticipantModel;
	private userModel = UserModel;

	public getEventById = async (
		eventId: number,
	): Promise<EventModel | null> => {

		try {

			const event = await this.eventModel.findByPk(eventId, {
				include: [
					{
						as: "event_manager",
						model: this.userModel,
						attributes: ["id", "name", "email"],
					},
					{
						as: "event_participants",
						model: this.eventParticipantModel,
						attributes: ["id"],
						include: [
							{
								as: "participant",
								model: this.userModel,
								attributes: [
									"id",
									"name",
									"email",
									"role",
									"phone_number",
								],
							},
						],
					},
				],
			});
			return event;
		} catch (error) {
			throw new HttpException(500, "Error fetching event");
		}
	};

	public getAllEvents = async (filters: Partial<eventFiltersAttributes>): Promise<EventModel[]> => {
		try {

			const eventFilterOptions = {
				where: {}
			}

			if (filters.event_type) {
				eventFilterOptions.where = {
					...eventFilterOptions.where,
					event_type: { [Op.regexp]: `.*${filters.event_type}.*` },
				};
			}

			if (filters.search) {
				eventFilterOptions.where = {
					...eventFilterOptions.where,
					event_title: { [Op.regexp]: `.*${filters.search}.*` },
				};
			}


			const events = await this.eventModel.findAll({
				...eventFilterOptions,
				include: [
					{
						as: "event_manager",
						model: this.userModel,
						attributes: ["id", "name", "email"],
					},
					{
						as: "event_participants",
						model: this.eventParticipantModel,
						attributes: ["id"],
						include: [
							{
								as: "participant",
								model: this.userModel,
								attributes: [
									"id",
									"name",
									"email",
									"role",
									"phone_number",
								],
							},
						],
					},
				],
			});

			return events;
		} catch (error) {
			throw new HttpException(500, "Unable to fetch events");

		}
	};

	public createEvent = async (
		eventData: Partial<EventAttributes>,
	): Promise<EventModel> => {

		try {
			const newEvent = await this.eventModel.create(eventData);

			return newEvent;
		} catch (error) {
			throw new HttpException(500, "Unable to create Event");
		}
	};

	public updateEvent = async (
		eventId: number,
		updatedData: Partial<EventAttributes>,
	): Promise<EventModel> => {
		try {
			await this.eventModel.update(updatedData, {
				where: { id: eventId },
				returning: true,
			});
			const updatedEvent = await this.eventModel.findByPk(eventId);

			return updatedEvent;
		} catch (error) {
			throw new HttpException(500, "Unable to update event");
		}
	};

	public deleteEvent = async (eventId: number): Promise<number> => {
		try {
			const deletedRowsCount = await EventModel.destroy({
				where: { id: eventId },
			});
			return deletedRowsCount;
		} catch (error) {
			throw new HttpException(500, "Unable to delete event");

		}
	};
}

export { EventService };
