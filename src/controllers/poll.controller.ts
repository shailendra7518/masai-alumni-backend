import { PollService } from "@services/poll.service";
import { QuestionService } from "@services/question.service";
import { Response, NextFunction } from "express";
import { PollResponseService } from "@services/pollResponse.service";
import { NoticeService } from "@services/notice.service";
import { CustomRequest } from "@interfaces/CustomRequest";
import { HttpException } from "@exceptions/HttpException";


class PollController {
	private pollService = new PollService();
	private questionService = new QuestionService();
	private noticeService = new NoticeService();
	private pollResponseService = new PollResponseService();

	public getPollById = async (
		req: CustomRequest,
		res: Response,
		next: NextFunction,
	): Promise<void> => {
		const userId = Number(req.user.id);
		const pollId = Number(req.params.id);
		try {
			const poll = await this.pollService.getPollById(pollId);

			const e = poll.toJSON();

			const ans = {
				...e,
				response: await this.pollResponseService.getResponsesByPollId(
					e.id,userId
				),
			};

			if (ans) {
				res.status(200).json(ans);
			} else {
				next(new HttpException(404, "Poll not found"));
			}
		} catch (error) {
			next(error);
		}
	};

	public getPollsByUserId = async (
		req: CustomRequest,
		res: Response,
		next: NextFunction,
	): Promise<void> => {
		const userId = Number(req.user.id);
		try {
			const polls = await this.pollService.getPollByUserId(userId);
			if (polls.length > 0) {
				res.status(200).json(polls);
			} else {
				next(new HttpException(404, "Poll not found"));
			}
		} catch (error) {
			next(error);
		}
	};

	public createPoll = async (
		req: CustomRequest,
		res: Response,
		next: NextFunction,
	): Promise<void> => {
		const { poll, question } = req.body;
		const id = Number(req.user.id);

		try {
			const newPoll = await this.pollService.createPoll({
				creater_id: id,
				...poll,
			});
			const questionWithPollId = {
				...question,
				poll_id: newPoll.toJSON().id,
			};
			const newQuestion =
				await this.questionService.createQuestion(questionWithPollId);
			await this.noticeService.createNotice({
				attachmentId: newPoll.toJSON().id,
				category: "poll",
				authorId: id,
			});

			res.status(201).json({ poll: newPoll, question: newQuestion });
		} catch (error) {
			next(error);
		}
	};

	public deletePoll = async (
		req: CustomRequest,
		res: Response,
		next: NextFunction,
	): Promise<void> => {
		const pollId = Number(req.params.id);
		const userId = Number(req.user.id);

		try {
			await this.questionService.deleteQuestionByPollId(pollId);
			const deletedRowsCount = await this.pollService.deletePoll(
				pollId,
				userId,
			);

			if (deletedRowsCount === 0) {
				throw new HttpException(404, "Poll not found");
			} else {
				await this.noticeService.deleteNoticebyAttachmentID(pollId,'poll')
				res.status(200).json({
					message: "Poll deleted successfully",
				});

			}
			



		} catch (error) {
			next(error);
		}
	};
}

export { PollController };
