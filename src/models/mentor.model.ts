import { Model, DataTypes } from "sequelize";
import sequelize from "@configs/db";
import { MentorAttributes } from "@interfaces/mentorTypes";
import { UserModel } from "./user.model";
import { FeedbackModel } from "./feedback.model";

class MentorModel extends Model<MentorAttributes> implements MentorAttributes {
	public id!: number;
	public expertise!: string;
	public preferred_communication!: any;
	public experience_years!: number;
	public target_mentee!: any;
	public discription!: string;
	public is_active!:boolean;
	public user_id!: number;
	public application_status: boolean;
}

MentorModel.init(
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
			allowNull: false,
		},
		expertise: {
			type: DataTypes.STRING,
			allowNull: true,
			
		},

		preferred_communication: {
			type: DataTypes.JSON,
			allowNull: true,
			defaultValue:[]
		},
		experience_years: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		target_mentee: {
			type: DataTypes.JSON,
			allowNull: true,
			defaultValue:[]
		},
		discription: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		user_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		application_status: {
			type: DataTypes.BOOLEAN,
			allowNull: true,
			defaultValue:false
		},
		is_active: {
			type: DataTypes.BOOLEAN,
			allowNull: true,
			defaultValue:true
		},
	},
	{
		sequelize,
		modelName: "Mentor",
		tableName: "mentors",
	},
);

MentorModel.belongsTo(UserModel, {
	as: "user",
	foreignKey: "user_id",
	targetKey: "id",
});

MentorModel.hasMany(FeedbackModel, {
	as: "feedbacks",
	foreignKey: "mentor_id"
});
export { sequelize, MentorModel };
