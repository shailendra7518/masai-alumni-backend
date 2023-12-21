import { DataTypes, Model } from "sequelize";
import sequelize from "@configs/db";
import { GroupMembershipAttributes } from "@interfaces/groupTypes";

import { UserModel } from "./user.model";
import { GroupModel } from "./group.model";



class GroupMembershipModel extends Model<GroupMembershipAttributes> implements GroupMembershipAttributes {
	public id!: number;
	public groupId!: number;
	public userId!: number;
	public status!: 'pending' | 'accepted' | 'rejected';
}

GroupMembershipModel.init({
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
		allowNull: false,
	},
	groupId: {
		type: DataTypes.INTEGER,
		allowNull: false,
	},
	userId: {
		type: DataTypes.INTEGER,
		allowNull: false,
	},
	status:{
		type: DataTypes.STRING,
		allowNull: false,
		defaultValue: 'pending',
	},
}, {
	sequelize,
	modelName: "GroupMembership",
	tableName: "group_memberships",
	timestamps: true
});


GroupModel.belongsToMany(UserModel, { through: GroupMembershipModel, foreignKey: 'groupId', as: 'GroupMembers' });
UserModel.belongsToMany(GroupModel, { through: GroupMembershipModel, foreignKey: 'userId', as: 'GroupMemberships' });

export {GroupMembershipModel,sequelize}
