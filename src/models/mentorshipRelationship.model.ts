// models/mentorshipRelationshipModel.ts
import { Model, DataTypes } from "sequelize";
import sequelize from "@configs/db";
import { MentorshipRelationshipAttributes } from "@interfaces/mentorshipRelationshipTypes";

class MentorshipRelationshipModel
	extends Model<MentorshipRelationshipAttributes>
	implements MentorshipRelationshipAttributes
{
	public id!: number;
	public mentee_id!: number;
	public mentor_id!: number;
	public status!: "pending" | "accepted" | "rejected";
	public problem: string;
	public preferred_domain?: String[];
	public preferred_communication: String[];
	public mentee_status: string;
}

MentorshipRelationshipModel.init(
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
			allowNull: false,
		},
		mentee_status: {
			type: DataTypes.STRING,
			allowNull: true,
			defaultValue:'active'
		},
		mentee_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		mentor_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		problem: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		preferred_domain: {
			type: DataTypes.JSON,
			allowNull: true,
		},
		preferred_communication: {
			type: DataTypes.JSON,
			allowNull: false,
		},
		status: {
			type: DataTypes.ENUM("pending", "accepted", "rejected"),
			allowNull: false,
			defaultValue: "pending",
		},
	},
	{
		sequelize,
		modelName: "MentorshipRelationship",
		tableName: "mentorship_relationships",
	},
);

export { sequelize, MentorshipRelationshipModel };
