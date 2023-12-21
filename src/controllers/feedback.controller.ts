import { Request, Response } from 'express';
import { FeedbackService } from '@services/feedback.service'; // Import your FeedbackService

class FeedbackController {
    private feedbackService = new FeedbackService(); // Create an instance of your FeedbackService

    public createFeedback = async (req: Request, res: Response): Promise<void> => {
        const { mentorid, menteeid, feed, rating } = req.body;

        try {
            await this.feedbackService.createFeedback(mentorid, menteeid, feed, rating);
            res.status(201).json({ message: 'Feedback created successfully' });
        } catch (error) {
            console.error('Error creating feedback:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    };

    public calculateAndUpdateRating = async (req: Request, res: Response): Promise<void> => {
        const mentorid = +req.params.mentorid;
        const rating = +req.body.rating;

        try {
            await this.feedbackService.calculateAndUpdateRating(mentorid, rating);
            res.json({ message: 'Rating calculated and updated successfully' });
        } catch (error) {
            console.error('Error calculating and updating rating:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    };

    public deleteFeedback = async (req: Request, res: Response): Promise<void> => {
        const feedbackId = +req.params.feedbackId;

        try {
            await this.feedbackService.deleteFeedback(feedbackId);
            res.json({ message: 'Feedback deleted successfully' });
        } catch (error) {
            console.error('Error deleting feedback:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    };

    public getAllFeedbacksForMentor = async (req: Request, res: Response): Promise<void> => {
        const mentorId = +req.params.mentorId;

        try {
            const feedbacks = await this.feedbackService.getAllFeedbacksForMentor(mentorId);
            res.json(feedbacks);
        } catch (error) {
            console.error('Error fetching feedbacks for mentor:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    };
}

export default FeedbackController;
