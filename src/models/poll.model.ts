import sequelize from "@configs/db";
import { PollAttributes } from "@interfaces/poll.Types";
import { Model, DataTypes } from "sequelize";
import { QuestionModel } from "./question.model";
import { UserModel } from "./user.model";
class PollModel extends Model<PollAttributes> implements PollAttributes {
	public id!: number;
	public creater_id: number;
	public title!: string;
	public duration: number;

	static associate() {
		this.hasMany(QuestionModel, {
			foreignKey: "poll_id",
			as: "questions",
		});
	}
	

}

PollModel.init(
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
			allowNull: false,
		},
		creater_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		title: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		duration: {
			type: DataTypes.INTEGER,
			allowNull:false
		}
	},
	{
		sequelize,
		modelName: "Poll",
		tableName: "polls",
	},
);

PollModel.associate();

export { sequelize, PollModel };
