import { DataTypes, Model } from "sequelize";
import sequelize from "@configs/db";
import { GroupAttributes } from "@interfaces/groupTypes";

class GroupModel extends Model<GroupAttributes> implements GroupAttributes {
    public id!: number;
    public name!: string;
    public description!: string;
    public privacy!: 'public' | 'private' | 'invite-only';
    public createdAt!: Date;
    public updatedAt!: Date;
    public lastMessage!: number;
    public membersCount!: number;
    public avatarURL!: string;
    public coverPhotoURL!: string;
    public admins!: number[];

    static associate(models: any) {
        this.belongsTo(models.Message, { foreignKey: 'lastMessage', as: 'lastMessageInfo',targetKey:"id" });
        this.belongsToMany(models.User, {
            through: 'GroupAdmins',
            as: 'admins',
            foreignKey: 'groupId',
        });
    }
}

GroupModel.init(
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
			allowNull: false,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		description: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		privacy: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: 'public',
		},
		createdAt: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: DataTypes.NOW,
		},
		updatedAt: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: DataTypes.NOW,
		},
		lastMessage: {
			type: DataTypes.INTEGER,
			allowNull: true,
		},
		membersCount: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 0,
		},
		avatarURL: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		coverPhotoURL: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		admins: {
			type: DataTypes.JSON,
			allowNull: false,
			defaultValue: [],
		}
	},
	{
		sequelize,
		modelName: 'Group',
		tableName: 'groups',
	}
);

export { GroupModel, GroupAttributes };
