import sequelize from '@configs/db';
import { UserAttributes } from '@interfaces/users';
import { Model, DataTypes } from 'sequelize';

class UserModel extends Model<UserAttributes> implements UserAttributes {
	public id!: number;
	public name!: string;
	public email!: string;
	public phone_number!: string;
	public password!: string;
	public role!: string;
	public user_profile_photo_path!: string;
	public resetToken!: string;
	public resetTokenExpiration!: Date;
	public socket_id!: string;
	public isOnline!: boolean;
	public current_chat_info: { current_chat_id: number; type: 'private' | 'group'; };
}

UserModel.init(
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
			allowNull: false,
		},
		name: {
			type: DataTypes.STRING(255),
			allowNull: false,
		},
		email: {
			type: DataTypes.STRING(255),
			allowNull: false,
		},
		phone_number: {
			type: DataTypes.STRING(15),
		},
		password: {
			type: DataTypes.STRING(255),
		},
		role: {
			type: DataTypes.STRING(255),
		},
		user_profile_photo_path: {
			type: DataTypes.STRING(255),
		},
		resetToken: {
			type: DataTypes.STRING(255),
		},
		resetTokenExpiration: {
			type: DataTypes.DATE,
			allowNull: true,
		},
		socket_id: {
			type: DataTypes.STRING(255),
			allowNull: true,
		},
		current_chat_info: DataTypes.JSON,
		isOnline: {
			type: DataTypes.BOOLEAN,
			allowNull: true,
		}
	},
	{
		sequelize,
		modelName: 'user',
		tableName: 'users',
		timestamps: false,
	}
);

export { sequelize, UserModel };
