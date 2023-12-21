import { CustomRequest } from "@interfaces/CustomRequest";
import { EventParticipantService } from "@services/eventParticipant.service";
import { Request, Response } from "express";

class EventParticipantController {
	private eventParticipantService = new EventParticipantService();

	public getEventParticipantById = async (
		req: Request,
		res: Response
	): Promise<void> => {
		const eventParticipantId = Number(req.params.id);

		try {
			const eventParticipant =
				await this.eventParticipantService.getEventParticipantById(
					eventParticipantId,
				);
			if (eventParticipant) {
				res.json(eventParticipant);
			} else {
				res.status(404).json({
					message: "Event Participant not found",
				});
			}
		} catch (error) {
			res.status(500).json({ error: "Internal Server Error" });
		}
	};

	public getEventParticipantByEventId = async (
		req: Request,
		res: Response,
	): Promise<void> => {
		const eventId = +req.params.id;

		try {
			const eventParticipant =
				await this.eventParticipantService.getEventParticipantByEventId(eventId);
			if (eventParticipant) {
				res.json(eventParticipant);
			} else {
				res.status(404).json({
					message: "Event Participant not found",
				});
			}
		} catch (error) {
			res.status(500).json({ error: "Internal Server Error" });
		}
	};

	public getAllEventParticipants = async (
		req: Request,
		res: Response,
	): Promise<void> => {
		try {
			const eventParticipants =
				await this.eventParticipantService.getAllEventParticipants();
			res.json(eventParticipants);
		} catch (error) {
			res.status(500).json({ error: "Internal Server Error" });
		}
	};

	public createEventParticipant = async (
		req: CustomRequest,
		res: Response,
	): Promise<void> => {
		const participantId = req.user.id;
		const eventParticipantData = req.body;

		try {
			const newEventParticipant =
				await this.eventParticipantService.createEventParticipant({
					...eventParticipantData,
					participant_id:participantId
				});

			console.log(newEventParticipant);
			res.status(201).json(newEventParticipant);
		} catch (error) {
			res.status(500).json({ error: "Internal Server Error" });
		}
	};


	public deleteEventParticipant = async (
		req: Request,
		res: Response,
	): Promise<void> => {
		const eventParticipantId = Number(req.params.id);

		try {
			const deletedRowsCount =
				await this.eventParticipantService.deleteEventParticipant(
					eventParticipantId,
				);

			if (deletedRowsCount === 0) {
				res.status(404).json({
					message: "Event Participant not found",
				});
			} else {
				res.status(202).json({ message: "Event Participant deleted successfully" });
			}
		} catch (error) {
			res.status(500).json({ error: "Internal Server Error" });
		}
	};
}

export { EventParticipantController };
