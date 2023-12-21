import { Model, DataTypes } from "sequelize";
import { SkillAttributes } from "@interfaces/skillTypes"; 
import sequelize from "@configs/db";

class SkillModel extends Model<SkillAttributes> implements SkillAttributes {
	public id: number;
	public profile_id: number;
	public user_id: number;
	public skill_name!: string;
	public used_on!: string;
}

SkillModel.init(
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey:true
		},
	    profile_id: {
			type: DataTypes.INTEGER,
			allowNull:false
		},
		user_id: {
			type: DataTypes.INTEGER,
			allowNull:false
		}
		,
		skill_name: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		used_on: {
			type: DataTypes.STRING,
			allowNull: true,
		},
	},
	{
		sequelize,
		modelName: "Skill",
		tableName: "skills", // Set the table name to 'skills'
	},
);

//  SkillModel.belongsTo(ProfileModel, {
// 		foreignKey: "skill_id",
// 		as: "profiles", 
//  });

export { sequelize, SkillModel };
