
import { Router } from "express";
import { Routes } from "@interfaces/routes.interface";
import { QuestionController } from "@controllers/question.controller";
import { ensureAuth } from "@middlewares/auth.middleware";



class QuestionRoute implements Routes {
	public path = "/questions";
	public router = Router();
	public questionController = new QuestionController();

	constructor() {
		this.initializeRoutes();
	}

	private initializeRoutes() {
		console.log("----------------------------------------------")
		this.router.get(this.path, this.questionController.getAllQuestions);
	}
}

export default QuestionRoute;
