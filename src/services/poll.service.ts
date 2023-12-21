import { HttpException } from "@exceptions/HttpException";
import { PollAttributes } from "@interfaces/poll.Types";
import { NoticeModel } from "@models/notice.model";
import { PollModel } from "@models/poll.model";
import { QuestionModel } from "@models/question.model";
class PollService {
	private pollModel = PollModel;
	private questionModel = QuestionModel;
	private noticeModel = NoticeModel;
	public getPollById = async (pollId: number): Promise<PollModel | null> => {
		try {
			const poll = await this.pollModel.findByPk(pollId, {
				include: [
					{
						model: this.questionModel,
						as: "questions",
					},
				],
			});
			return poll;
		} catch (error) {
			throw new HttpException(500, "Error fetching poll");
		}
	};

	public getPollByUserId = async (
		userId: number,
	): Promise<PollModel[] | null> => {
		try {
			
			const polls = await this.pollModel.findAll({
				where: { creater_id: userId },
				include: [
					{
						model: this.questionModel,
						as: "questions",
					},
				],
			});
			return polls;
		} catch (error) {
			throw new HttpException(500, "Error fetching polls");
		}
	};

	public createPoll = async (
		pollData: Partial<PollAttributes>,
	): Promise<PollModel> => {
		try {
			let newPoll = await this.pollModel.create(pollData);
			newPoll = await this.pollModel.findByPk(newPoll.id);

			return newPoll;
		} catch (error) {
			throw new HttpException(
				500,
				"Unable to create Poll with Questions and Options",
			);
		}
	};
	public deletePoll = async (
		pollId: number,
		userId: number,
	): Promise<number> => {
		try {
			const poll = await this.pollModel.findOne({
				where: { id: pollId, creater_id: userId },
			});

			if (!poll) {
				throw new HttpException(
					404,
					"Poll not found or you are not authorized to delete it.",
				);
			}

		 const deletedRowsCount=   await this.pollModel.destroy({
				where: { id: pollId },
			});
			

			return deletedRowsCount;
		} catch (error) {
			throw new HttpException(500, "Unable to delete poll");
		}
	};
}

export { PollService };
