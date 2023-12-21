import { HttpException } from "@exceptions/HttpException";
import { EventParticipantAttributes } from "@interfaces/eventParticipantTypes";
import { EventParticipantModel } from "@models/eventParticipant.model";

class EventParticipantService {
	private eventParticipantModel = EventParticipantModel;

	public getEventParticipantById = async (
		eventParticipantId: number,
	): Promise<EventParticipantModel | null> => {
		try {
			const eventParticipant =
				await this.eventParticipantModel.findByPk(eventParticipantId);
			return eventParticipant;
		} catch (error) {
			throw new HttpException(500, "Error fetching event participant");
		}
	};

	public getEventParticipantByEventId = async (
		eventId: number,
	): Promise<EventParticipantModel[] | null> => {
		try {
			const eventParticipants = await this.eventParticipantModel.findAll({
				where: { event_id: eventId },
			});
			return eventParticipants;
		} catch (error) {
			throw new HttpException(500, "Error fetching event participant");
		}
	};

	public getAllEventParticipants = async (): Promise<
		EventParticipantModel[]
	> => {
		try {
			const eventParticipants =
				await this.eventParticipantModel.findAll();
			return eventParticipants;
		} catch (error) {
			throw new HttpException(500, "Unable to fetch event participants");
		}
	};

	public createEventParticipant = async (
		eventParticipantData: Partial<EventParticipantAttributes>,
	): Promise<EventParticipantModel> => {
		try {
			let newEventParticipant =
				await this.eventParticipantModel.create(eventParticipantData);
			newEventParticipant = await this.eventParticipantModel.findByPk(
				newEventParticipant.id,
			);
			return newEventParticipant;
		} catch (error) {
			throw new HttpException(500, "Unable to create Event Participant");
		}
	};

	public deleteEventParticipant = async (
		eventParticipantId: number,
	): Promise<number> => {
		try {
			const deletedRowsCount = await EventParticipantModel.destroy({
				where: { id: eventParticipantId },
			});
			return deletedRowsCount;
		} catch (error) {
			throw new HttpException(500, "Unable to delete event participant");
		}
	};
}

export { EventParticipantService };
