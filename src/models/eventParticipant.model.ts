import sequelize from "@configs/db";
import { EventParticipantAttributes } from "@interfaces/eventParticipantTypes";
import { Model, DataTypes } from "sequelize";
import { UserModel } from "./user.model";
class EventParticipantModel
	extends Model<EventParticipantAttributes>
	implements EventParticipantAttributes
{
	public id!: number;
	public event_id!: number;
	public participant_id!: number;
}

EventParticipantModel.init(
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		event_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		participant_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
	},
	{
		sequelize,
		modelName: "eventParticipant",
		tableName: "eventParticipants",
		timestamps: true
	},
);

EventParticipantModel.belongsTo(UserModel, {
	as: "participant",
	foreignKey: "participant_id",
});

export { sequelize, EventParticipantModel };
