import sequelize from "@configs/db";
import { EventAttributes } from "@interfaces/eventTypes";
import { Model, DataTypes } from "sequelize";
import { UserModel } from "./user.model";
import { EventParticipantModel } from "./eventParticipant.model";

class EventModel extends Model<EventAttributes> implements EventAttributes {
	public id!: number;
	public event_title!: string;
	public event_description!: string;
	public event_type!: string;
	public manager_id!: number;
	public participants!: string;
	public event_mode!: string;
	public event_time!: string;
	public event_date!: Date;
	public event_url!: string;
	public event_status!: string;
	public event_banner!: string;
	public event_speakers!: string;
}

EventModel.init(
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		event_title: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		event_description: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		event_type: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		manager_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		event_mode: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		event_time: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		event_date: {
			type: DataTypes.DATE,
			allowNull: false,
		},
		event_url: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		event_status: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		event_banner: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		event_speakers: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	},
	{
		sequelize,
		modelName: "event",
		tableName: "events",
		timestamps: true
	},
);

EventModel.belongsTo(UserModel, {
	as: "event_manager",
	foreignKey: "manager_id",
	targetKey: "id",
});

EventModel.hasMany(EventParticipantModel, {
	as: "event_participants",
	foreignKey: "event_id",
});

export { sequelize, EventModel };
