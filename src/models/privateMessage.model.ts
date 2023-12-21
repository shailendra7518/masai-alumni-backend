import { DataTypes, Model } from "sequelize";
import sequelize from "@configs/db";
import { PrivateMessageAttributes, attachmentType } from "@interfaces/messageTypes";

class privateMessageModel extends Model<PrivateMessageAttributes> implements PrivateMessageAttributes {
	public id!: number;
	public authorId!: number;
	public receiverId!: number;
	public messageType!: "private";
	public content!: string;
	public status!: "delivered" | "seen";
	public attachments?: attachmentType[];
	static associate(models: any) {
		privateMessageModel.belongsTo(models.User, { foreignKey: 'authorId', as: 'author' });
		privateMessageModel.belongsTo(models.User, { foreignKey: 'receiverId', as: 'reciever' });
	}
}
privateMessageModel.init(
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
		status: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		attachments: {
			type: DataTypes.JSON,
			allowNull: true,
			defaultValue: [],
		},
		receiverId: {
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
		modelName: 'privateMessage',
		tableName: 'privatemessages',
		timestamps: true,
		underscored: true,
	}
);

export { privateMessageModel };
