import sequelize from "@configs/db";
import { FeedbackAttributes } from "@interfaces/feedbackTypes";
import { DataTypes, Model } from "sequelize";

class FeedbackModel
	extends Model<FeedbackAttributes>
	implements FeedbackAttributes
{
	public id!: number;
	public mentor_id!: number;
	public mentee_id!: number;
	public feed!: string;
	public rating!: number;
}

// Initialize the Sequelize model

FeedbackModel.init(
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		mentor_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		mentee_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		feed: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		rating: {
			type: DataTypes.FLOAT(2, 1),
			allowNull: true,
			validate: {
				min: 1, // Minimum value
				max: 5, // Maximum value
			},
		},
	},
	{
		sequelize,
		modelName: "Feedback", // Set your desired model name
		tableName: "feedbacks", // Set your desired table name
		timestamps: true, // Set to true if you want timestamps
	},
);

export { sequelize, FeedbackModel };
