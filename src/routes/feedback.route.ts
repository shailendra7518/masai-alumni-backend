// Importing necessary modules for defining Express routes and handling HTTP requests
import { Router } from "express";
import { Routes } from "@interfaces/routes.interface";
import FeedbackController from "@controllers/feedback.controller"; 
import { ensureAuth } from "@middlewares/auth.middleware";


class FeedbackRoute implements Routes {
    public path = "/feedbacks";
    public router = Router();
    public feedbackController = new FeedbackController();
    constructor() {
        this.initializeRoutes();
    }

  
    private initializeRoutes() {
        

        // New route for creating feedback
        this.router.post(`${this.path}/create`,ensureAuth,this.feedbackController.createFeedback,);
        this.router.post(`${this.path}/calculate-rating/:mentorid`,ensureAuth,this.feedbackController.calculateAndUpdateRating,);
        this.router.delete(`${this.path}/delete/:feedbackId`,ensureAuth,this.feedbackController.deleteFeedback,);
        this.router.get(`${this.path}/mentor/:mentorId`,ensureAuth,this.feedbackController.getAllFeedbacksForMentor,);

    }
}

// Exporting the FeedbackRoute class
export default FeedbackRoute;
