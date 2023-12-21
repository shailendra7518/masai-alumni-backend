import { Model, DataTypes } from "sequelize";
import { ProfileAttributes, Link, Interest } from "@interfaces/profileTypes";
import sequelize from "@configs/db";
import { UserModel } from "./user.model";
import { ExperienceModel } from "./experience.model";
import { EducationModel } from "./education.model";
import { AddressModel } from "./address.model";
import { SkillModel } from "./skills.model";

class ProfileModel
	extends Model<ProfileAttributes>
	implements ProfileAttributes
{
	public id!: number;
	public user_id!: number;
	public start_date!: Date;
	public end_date!: Date;
	public start_batch!: string;
	public end_batch!: string;
	public roll_number!: string;
	public secondary_email!: string;
	public secondary_contactNumber!: string;
	public city!: string;
	public current_company!: string;
	public current_designation!: string;
	public gender!: string;
	public user_name!: string;
	public resume!: string;
	public about!: string;
	public banner!: string;
	public birth_date!: Date;
	public links!: Link[];
	public interests!: Interest[];
	public placement_date!: Date;
	public dropout_date!: Date;
}

ProfileModel.init(
	{
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: false,
			primaryKey: true,
			unique: true,
		},
		user_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			unique: true,
		},
		user_name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		birth_date: {
			type: DataTypes.DATE,
			allowNull: true,
		},
		secondary_email: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		secondary_contactNumber: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		city: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		current_company: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		current_designation: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		gender: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		about: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		start_date: {
			type: DataTypes.DATE,
			allowNull: true,
		},
		end_date: {
			type: DataTypes.DATE,
			allowNull: true,
		},
		start_batch: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		end_batch: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		roll_number: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		banner: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		interests: {
			type: DataTypes.JSON,
			allowNull: true,
			defaultValue: [],
		},
		links: {
			type: DataTypes.JSON,
			allowNull: true,
			defaultValue: [],
		},
		resume: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		placement_date: {
			type: DataTypes.DATE,
			allowNull: true,
		},
		dropout_date: {
			type: DataTypes.DATE,
			allowNull: true,
		},
	},
	{
		sequelize,
		modelName: "Profile",
		tableName: "profiles",
	},
);

ProfileModel.belongsTo(UserModel, {
	as: "user_data",
	foreignKey: "user_id",
	targetKey: "id",
});

ProfileModel.hasMany(ExperienceModel, {
	as: "experiences",
	foreignKey: "profile_id",
});

ProfileModel.hasMany(EducationModel, {
	as: "educations",
	foreignKey: "profile_id",
});

ProfileModel.hasMany(AddressModel, {
	as: "addresses",
	foreignKey: "profile_id",
});

ProfileModel.hasMany(SkillModel, {
	as: "skills",
	foreignKey: "profile_id",
});

export { sequelize, ProfileModel };
