import { HttpException } from "@exceptions/HttpException";
import { QuestionService } from "@services/question.service";
import { NextFunction, Request, Response } from "express";
class QuestionController {
	private questionService = new QuestionService();

	public getAllQuestions = async (
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> => {
		try {
			const questions = await this.questionService.getAllQuestions();
			if (questions.length > 0) {
				res.status(200).json(questions);
			} else {
				next(new HttpException(404, "question not found"));
			}
		} catch (error) {
			next(error);
		}
	};

	// public createQuestion = async (
	// 	req: Request,
	// 	res: Response,
	// 	next: NextFunction,
	// ): Promise<void> => {
	// 	const questionData = req.body;

	// 	try {
	// 		const newQuestion =
	// 			await this.questionService.createQuestion(questionData);
	// 		res.status(201).json(newQuestion);
	// 	} catch (error) {
	// 		next(error);
	// 	}
	// };
	// public getQuestionById = async (
	// 	req: Request,
	// 	res: Response,
	// 	next: NextFunction,
	// ): Promise<void> => {
	// 	const questionId = +req.params.id;

	// 	try {
	// 		const question =await this.questionService.getQuestionById(questionId);
	// 		if (question) {
	// 			res.status(200).json(question);
	// 		} else {
	// 			next(new HttpException(404, "question not found"));
	// 		}
	// 	} catch (error) {
	// 		next(error);
	// 	}
	// };

	// public deleteQuestionByPollId = async (
	// 	req: Request,
	// 	res: Response,
	// 	next: NextFunction,
	// ): Promise<void> => {
	// 	const pollId = +req.params.id;

	// 	try {
	// 		const deletedRowsCount =
	// 			await this.questionService.deleteQuestionByPollId(pollId);
	// 		if (deletedRowsCount === 0) {
	// 			throw new HttpException(404, "Questions not found");
	// 		}
	// 		res.status(201).json({ message: "question deleted successfully" });
	// 	} catch (error) {
	// 		next(error);
	// 	}
	// };
	// public deleteQuestionById = async (
	// 	req: Request,
	// 	res: Response,
	// 	next: NextFunction,
	// ): Promise<void> => {
	// 	const Id = +req.params.id;

	// 	try {
	// 		await this.questionService.deleteQuestionByPollId(Id);

	// 		res.status(201).json({ message: "question deleted successfully" });
	// 	} catch (error) {
	// 		next(error);
	// 	}
	// };
}

export { QuestionController };
