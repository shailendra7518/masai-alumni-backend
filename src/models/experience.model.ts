import { Model, DataTypes } from "sequelize";
import { ExperienceAttributes } from "@interfaces/experienceTypes";
import sequelize from "@configs/db";
class ExperienceModel
	extends Model<ExperienceAttributes>
	implements ExperienceAttributes
{
	public id: number;
	public profile_id: number;
	public user_id: number;
	public title!: string;
	public designation!: string;
	public employment_type!: string;
	public company_name!: string;
	public industry!: string;
	public location!: string;
	public location_type!: string;
	public currently_working!: boolean;
	public start_date!: Date;
	public end_date: Date;
	public description: string;
}

ExperienceModel.init(
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		profile_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		user_id: {
			type: DataTypes.INTEGER,
			allowNull:false
		},
		title: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		designation: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		employment_type: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		company_name: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		industry: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		location: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		location_type: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		currently_working: {
			type: DataTypes.BOOLEAN,
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
		description: {
			type: DataTypes.STRING,
			allowNull: true,
		},
	},
	{
		sequelize,
		modelName: "Experience",
		tableName: "experiences",
		timestamps: true
	},
);

export { sequelize, ExperienceModel };
