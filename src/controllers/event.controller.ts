import { HttpException } from "@exceptions/HttpException";
import { CustomRequest } from "@interfaces/CustomRequest";
import { EventService } from "@services/event.service";
import { NoticeService } from "@services/notice.service";
import { NextFunction, Request, Response } from "express";

class EventController {
	private eventService = new EventService();
	private noticeService = new NoticeService();

	public getEventById = async (
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> => {
		const eventId = Number(req.params.id);

		try {
			const event = await this.eventService.getEventById(eventId);
			if (event) {
				res.status(200).json(event);
			} else {
				next(new HttpException(404, "Event not found"));
			}
		} catch (error) {
			next(error);
		}
	};

	public getAllEvent = async (
		req: CustomRequest,
		res: Response,
		next: NextFunction,
	): Promise<void> => {
		const userId = req.user.id;
		const filters = req.query;
		try {
			const events = await this.eventService.getAllEvents(filters);
			res.status(200).json({ events,loggedInUserId:userId});
		} catch (error) {
			next(error);
		}
	};

	public createEvent = async (
		req: CustomRequest,
		res: Response,
		next: NextFunction,
	): Promise<void> => {
		const eventData = req.body;
		// const id = Number(req.user.id) ;
		const id = Number(req.user.id);
		try {
			const newEvent = await this.eventService.createEvent({
				...eventData,
				manager_id: id,
			});
			await this.noticeService.createNotice({
				attachmentId: newEvent.id,
				category: "event",
				authorId: id,
			});
			res.status(201).json(newEvent);
		} catch (error) {
			next(error);
		}
	};

	public updateEvent = async (
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> => {
		const eventId = Number(req.params.id);
		const updatedData = req.body;
		try {
			const updatedEvent = await this.eventService.updateEvent(
				eventId,
				updatedData,
			);

			if (!updatedEvent) {
				next(new HttpException(404, "Event not found"));
			} else {
				res.json({
					message: "event updated successfully",
					updatedEvent,
				});
			}
		} catch (error) {
			next(error);
		}
	};

	public deleteEvent = async (
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> => {
		const eventId = Number(req.params.id);

		try {
			const deletedRowsCount =
				await this.eventService.deleteEvent(eventId);

			if (deletedRowsCount === 0) {
				next(new HttpException(404, "Event not found"));
			} else {
				await this.noticeService.deleteNoticebyAttachmentID(eventId,'event');
				res.status(201).json({
					message: "Event deleted successfully",
					deletedRowsCount,
				});
			}
		} catch (error) {
			next(error);
		}
	};
}
export { EventController };
