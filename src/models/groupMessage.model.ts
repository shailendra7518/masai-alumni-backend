import { DataTypes, Model } from "sequelize";
import sequelize from "@configs/db";
import { groupMessageAttributes, attachmentType } from "@interfaces/messageTypes";

class groupMessageModel extends Model<groupMessageAttributes> implements groupMessageAttributes {
	public id!: number;
	public authorId!: number;
	public groupId!: number;
	public messageType!: "group";
	public content!: string;
	public attachments?: attachmentType[];
	static associate(models: any) {
		groupMessageModel.belongsTo(models.User, { foreignKey: 'authorId', as: 'author' });
		groupMessageModel.belongsTo(models.group, { foreignKey: 'groupId', as: 'group' });
	}
}
groupMessageModel.init(
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		authorId: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		content: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		attachments: {
			type: DataTypes.JSON,
			allowNull: true,
			defaultValue: [],
		},
		groupId: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		messageType: {
			type: DataTypes.STRING,
			allowNull: false,
		}
	},

	{
		sequelize,
		modelName: 'groupMessage',
		tableName: 'groupmessages',
		timestamps: true,
		underscored: true,
	}
);

export { groupMessageModel };
