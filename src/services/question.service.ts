import { HttpException } from "@exceptions/HttpException";
import { QuestionAttributes } from "@interfaces/question.Types";
import { QuestionModel } from "@models/question.model";

class QuestionService {
	private questionModel = QuestionModel;
	public createQuestion = async (
		questionData: Partial<QuestionAttributes>,
	): Promise<QuestionModel> => {
		try {
			const newQuestion = await this.questionModel.create(questionData);

			return newQuestion;
		} catch (error) {
			throw new HttpException(
				500,
				"Unable to create Poll with Questions and Options",
			);
		}
	};

	public getQuestionById = async (Id: number): Promise<QuestionModel> => {
		try {
			const question = await this.questionModel.findByPk(Id);

			return question;
		} catch (error) {
			throw new HttpException(500, "Error fething questions");
		}
	};

	public getAllQuestions = async (): Promise<QuestionModel[]> => {
		try {
			const questions = await this.questionModel.findAll();

			return questions;
		} catch (error) {
			throw new HttpException(500, "Error fething questions");
		}
	};

	public deleteQuestionById = async (Id: number): Promise<number> => {
		try {
			const deletedRowsCount = await this.questionModel.destroy({
				where: { id: Id },
			});

			return deletedRowsCount;
		} catch (error) {
			throw new HttpException(500, "Error deleting question");
		}
	};

	public deleteQuestionByPollId = async (pollId: number): Promise<number> => {
		try {
			const question = await this.questionModel.findAll({
				where: { poll_id: pollId },
			});

			if (!question) {
				throw new HttpException(404, "Question not found");
			} else {
				const deletedRowsCount = await this.questionModel.destroy({
					where: { poll_id: pollId },
				});

				return deletedRowsCount;
			}
		} catch (error) {}
	};
}

export { QuestionService };
