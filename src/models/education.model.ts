import { Model, DataTypes } from "sequelize";
import { EducationAttributes } from "../interfaces/educationTypes";
import sequelize from "@configs/db";
class EducationModel
	extends Model<EducationAttributes>
	implements EducationAttributes
{
	public id: number;
	public profile_id: number;
	public institution!: string;
	public user_id: number;
	public course!: string;
	public field_of_study?: string;
	public grade!: string;
	public persuing!: boolean;
	public description?: string;
	public start_date!: Date;
	public end_date?: Date;
}

EducationModel.init(
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey:true
		},
		user_id: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		profile_id:{
			type: DataTypes.INTEGER,
			allowNull:false
		},
		institution: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		course: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		field_of_study: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		grade: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		persuing: {
			type: DataTypes.BOOLEAN,
			allowNull: true,
		},
		description: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
		start_date: {
			type: DataTypes.DATE,
			allowNull: true,
		},
		end_date: {
			type: DataTypes.DATE,
			allowNull: true,
		},
	},
	{
		sequelize,
		modelName: "Education",
		tableName: "educations",
		timestamps: true
	},
);

export { sequelize, EducationModel };
