import { HttpException } from "@exceptions/HttpException";
import { EducationModel } from "../models/education.model";
import { EducationAttributes } from './../interfaces/educationTypes';

class EducationService {


	// Create a new education record
	public createEducation = async (
		userId:number,
		educationData: EducationAttributes
		
	): Promise<EducationModel> => {
		try {
			const newEducation: EducationModel =
				await EducationModel.create({ ...educationData ,user_id:userId});
			return newEducation;
        } catch (error) {
           throw new HttpException(500, "Error creating education record");
			
		}
	};

	public updateEducation = async(
		userId:number,
		educationId: number,
		updatedEducationData: EducationAttributes,
	): Promise<EducationModel> => {
		try {
			const education=await EducationModel.findOne({where:{id:educationId,user_id:userId}});

			if (education) {
				education.set(updatedEducationData);
				await education.save();
				return education;
			} else {
				return null;
			}
        } catch (error) {
            throw new HttpException(500, "Error updating education record");
		}
	};

	// Delete an education record
	public deleteEducation = async (userId:number,educationId: number): Promise<number> => {
		try {
			const deletedRowsCount: number = await EducationModel.destroy({
				where: { id: educationId ,user_id:userId },
			});
			return deletedRowsCount;
        } catch (error) {
        
            throw new HttpException(500, "Error deleting education record");
			
		}
	};
}

export default EducationService;
