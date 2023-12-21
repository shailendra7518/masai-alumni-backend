import { Model, DataTypes } from "sequelize";
import { AddressAttributes } from "../interfaces/addressTypes";
import sequelize from "@configs/db";
class AddressModel
	extends Model<AddressAttributes>
	implements AddressAttributes
{
	public id: number;
	public profile_id: number;
	public user_id: number;
	public type: string; // example - current-address , permanent-address;
	public street!: string;
	public city!: string;
	public state!: string;
	public zip!: string;
	public country?: string;
	public building_number?: string;
	public floor?: string;
}

AddressModel.init(
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		profile_id: {
			type: DataTypes.INTEGER,
			allowNull: true,
		},
		user_id: {
			type: DataTypes.INTEGER,
			allowNull:false
		},
		type: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		street: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		city: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		state: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		zip: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		country: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		building_number: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		floor: {
			type: DataTypes.STRING,
			allowNull: true,
		},
	},
	{
		sequelize,
		modelName: "Address",
		tableName: "addresses",
		timestamps: true,
		underscored: true,
	},
);

//  AddressModel.belongsTo(ProfileModel, {
// 		foreignKey: "profile_id",
// 		as: "profile",
//  });


export { sequelize, AddressModel };
