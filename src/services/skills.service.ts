import { HttpException } from "@exceptions/HttpException";
import { SkillModel } from "@models/skills.model";
import { SkillAttributes } from "@interfaces/skillTypes";

class SkillService {
	public createSkill = async (
		userId:number,
		skillData: SkillAttributes,
	): Promise<SkillModel> => {
		try {
			const newSkill = await SkillModel.create({ ...skillData,user_id:userId });
			return newSkill;
		} catch (error) {

			throw new HttpException(500, "Error creating skill record");
		}
	};

	public updateSkill = async (
		userId:number,
		skillId: number,
		updatedSkillData: SkillAttributes,
	): Promise<SkillModel | null> => {
		try {
			const skill = await SkillModel.findOne({ where:{ id:skillId,user_id:userId } });

			if (skill) {
				skill.set(updatedSkillData);
				await skill.save();
				return skill;
			} else {
				return null;
			}
		} catch (error) {

			throw new HttpException(500, "Error updating skill record");
		}
	};

	public deleteSkill = async (userId:number,skillId: number): Promise<number> => {
		try {
			const deletedRowsCount: number = await SkillModel.destroy({
				where: { id: skillId ,user_id:userId},
			});
			return deletedRowsCount;
		} catch (error) {

			throw new HttpException(500, "Error deleting skill record");
		}
	};
}

export default SkillService;
