import sequelize from "@configs/db";
import { PollResponseAttributes} from "@interfaces/pollResponse.Types";
import { Model, DataTypes } from "sequelize";
class PollResponseModel
	extends Model<PollResponseAttributes>
	implements PollResponseAttributes
{
	public id!: number;
	public poll_id: number;
	public responder_id: number;
	public response_count: number;
    public question_id: number;
	public selected_option: string;

}

PollResponseModel.init(
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
			allowNull: false,
		},
		poll_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		question_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		responder_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		response_count: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		selected_option: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	},
	{
		sequelize,
		modelName: "PollResponse",
		tableName: "pollResponses",
	},
);

export { sequelize, PollResponseModel };
