import { PollResponseService } from "@services/pollResponse.service";

import {  Response } from "express";
import { CustomRequest } from "@interfaces/CustomRequest";

class PollResponseController {
	private pollResponseService = new PollResponseService();

	public createPollResponse = async (
		req: CustomRequest,
		res: Response,
	): Promise<void> => {
		const userId = +req.user.id;
		const pollResponseData = { responder_id: userId, ...req.body };

		try {
			const newPollResponse =
				await this.pollResponseService.createPollResponse(
					pollResponseData,
					userId,
				);

			res.status(201).json(newPollResponse);
		} catch (error) {
			res.status(500).json({ error: "Internal Server Error" });
		}
	};
	public getResponseByPollId = async (
		req: CustomRequest,
		res: Response,
	): Promise<void> => {
		const userId=req.user.id;
		const pollId = +req.params.id;

		try {
			const PollResponses =
				await this.pollResponseService.getResponsesByPollId(pollId,userId);
			if (!PollResponses) {
				res.status(404).json({ message: "response not found" });
			} else {
				res.status(201).json(PollResponses);
			}
		} catch (error) {
			res.status(500).json({ error: "Internal Server Error" });
		}
	};
}

export { PollResponseController };
