import { HttpException } from '@exceptions/HttpException';
import { FeedbackModel } from '@models/feedback.model'; 
import { MentorModel } from '@models/mentor.model';
import { Op, Sequelize } from 'sequelize';

class FeedbackService {
    public createFeedback = async (mentor_id: number, mentee_id: number, feed: string, rating: number): Promise<FeedbackModel> => {
        try {
            // Assuming you have Sequelize instance created and named sequelize
            const feedback = await FeedbackModel.create({
                mentor_id,
                mentee_id,
                feed,
                rating,
            });

         return feedback
        } catch (error) {
            
            throw new HttpException(500,'Unable to create feedback');
        }
    };


    public calculateAndUpdateRating = async (mentor_id: number, rating: number): Promise<[number]> => {
        let star=rating;
        try {
            const ratings = await FeedbackModel.findAll({
                where: {
                    mentor_id,
                    rating: {
                        [Op.not]: null,
                    },
                },
                
                attributes: [[Sequelize.fn('AVG', Sequelize.col('star')), 'averageRating']],
            });

            const averageRating = ratings[0].get('averageRating') as number;

            if (!isNaN(averageRating)) {
                // Update the average rating in the FeedbackModel
             const updatedReating =  await FeedbackModel.update(
                    { rating: averageRating },
                    {
                        where: {
                            mentor_id,
                        },
                    }
                );
                return updatedReating;
               
            } else {
                throw new HttpException(404,"invalid rating")
            }
        } catch (error) {

          
            throw new HttpException(500,'Unable to calculate and update rating');
        }
    };


    public deleteFeedback = async (feedbackId: number): Promise<void> => {
        try {
            const feedback = await FeedbackModel.findByPk(feedbackId);

            if (!feedback) {
                throw new HttpException(404,'Feedback not found');
            }

            const deletedFeedback = await feedback.destroy();
            return deletedFeedback

        } catch (error) {
           
            throw new HttpException(500,'Unable to delete feedback');
        }
    };

    public getAllFeedbacksForMentor = async (mentor_id: number): Promise<any[]> => {
        try {
            const feedbacks = await FeedbackModel.findAll({
                where: {
                    mentor_id: mentor_id,
                },
            });

            return feedbacks;
        } catch (error) {
            
            throw new HttpException(500,'Unable to fetch feedbacks');
        }
    };
    
}







export {FeedbackService};
