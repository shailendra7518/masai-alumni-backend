import { HttpException } from "@exceptions/HttpException";
import { PollResponseAttributes } from "@interfaces/pollResponse.Types";
import { PollResponseModel } from "@models/PollResponse.model";
import { PollModel } from "@models/poll.model";
import { QuestionModel } from "@models/question.model";
class PollResponseService {
	private pollResponseModel = PollResponseModel;
	private questionModel = QuestionModel;
	private pollModel = PollModel;
	public createPollResponse = async (
		pollResponseData: Partial<PollResponseAttributes>,
		userId: number,
	): Promise<any> => {
		try {
			const pollResponse = await this.pollResponseModel.findOne({
				where: {
					responder_id: userId,
					poll_id: pollResponseData.poll_id,
				},
			});

			if (!pollResponse) {
				let newPoll = await this.pollResponseModel.create({
					...pollResponseData,
					response_count: 1,
				});
				newPoll = await this.pollResponseModel.findByPk(newPoll.id);
				return newPoll;
			} else if (
				pollResponse &&
				pollResponse.toJSON().response_count < 2
			) {
				if (pollResponse.toJSON().responder_id !== userId) {
					throw new HttpException(
						403,
						"You are not authorized to update this response",
					);
				}

				await this.pollResponseModel.update(
					{
						...pollResponseData,
						response_count:
							pollResponse.toJSON().response_count + 1,
					},
					{
						where: { id: pollResponse.toJSON().id },
						returning: true,
					},
				);
				return { message: "response updated successfully" };
			} else {
				return {
					message: "you cannot respond more than 2 times",
					oldResponse: pollResponse,
				};
			}
		} catch (error) {
			throw new HttpException(
				500,
				"Unable to create Poll with Questions and Options",
			);
		}
	};

	public checkIfResponded = async (
		pollId: number,
		userId: number,
	): Promise<PollResponseModel> => {
		try {
			const newPoll = await this.pollResponseModel.findOne({
				where: { poll_id: pollId, responder_id: userId },
			});

			return newPoll;
		} catch (error) {
			throw new HttpException(
				500,
				"Unable to check if user responded",
			);
		}
	};

	public getResponsesByPollId = async (pollId: number, userId: number): Promise<any> => {
		try {
			const Polls = await this.pollResponseModel.findAll({
				where: { poll_id: pollId },
			});
			const myResponse = (await this.pollResponseModel.findOne({ where: { responder_id: userId, poll_id: pollId } })).toJSON()
			const singlePoll = await this.pollModel.findByPk(pollId);
			const question = (
				await this.questionModel.findOne({ where: { poll_id: pollId } })
			).toJSON();


			const pollResponse = {
				selected_option: myResponse.selected_option,
				responder_id: myResponse.responder_id,
				question_id: question.id,
				question: question.text,
				participantCount: Polls.length,
				options: {
				},
			};

			question.options.forEach((e: any) => {

				if (pollResponse.options[e] == undefined) {
					pollResponse.options[e] = 0;
				}
				Polls.forEach((r) => {
					r = r.toJSON();



					if (e === r.selected_option) {
						if (pollResponse.options[e] === undefined) {
							pollResponse.options[e] = 1;
						} else {
							pollResponse.options[e]++;
						}
					}
				});
			});

			return { ...singlePoll.toJSON(), pollResponse };
		} catch (error) {
			throw new HttpException(
				500,
				"Unable to check if u",
			);
		}
	};
}

export { PollResponseService };
