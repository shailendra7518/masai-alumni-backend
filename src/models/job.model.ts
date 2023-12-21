import { Model, DataTypes } from 'sequelize';
import { Contacts, RequiredExperience, SalaryRange, JobAttributes, workMode, workType } from '@interfaces/jobTypes';
import sequelize from '@configs/db';
import { UserModel } from './user.model';

class JobModel extends Model<JobAttributes> implements JobAttributes {
	public id!: number;
	public publisher_id!: number;
	public title!: string;
	public company_name!: string;
	public description!: string;
	public company_address!: string;
	public application_deadline!: Date;
	public isopen!: boolean;
	public working_mode!: workMode;
	public work_type!: workType;
	public positions!: number;
	public skills!: string;
	public contacts!: string;
	public required_exp!: string;
	public salary!: string;
	public website_link!: string;
}

JobModel.init(
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
			allowNull: false,
		},
		publisher_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		title: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		company_name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		description: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		company_address: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		application_deadline: {
			type: DataTypes.DATE,
			allowNull: false,
		},
		isopen: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
		},
		working_mode: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		work_type: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		positions: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		skills: {
			type: DataTypes.TEXT,
			allowNull: true,
			defaultValue: JSON.stringify([]),
			get() {
				const rawValue = this.getDataValue('skills');
				return rawValue ? JSON.parse(rawValue) : [];
			},
			set(value: string[]) {
				this.setDataValue('skills', JSON.stringify(value));
			},
		},
		contacts: {
			type: DataTypes.TEXT,
			allowNull: true,
			defaultValue: JSON.stringify({
				phone: '',
				email: '',
				link: '',
			}),
			get() {
				const rawValue = this.getDataValue('contacts');
				return rawValue ? JSON.parse(rawValue) : {};
			},
			set(value: Contacts) {
				this.setDataValue('contacts', JSON.stringify(value));
			},
		},
		required_exp: {
			type: DataTypes.TEXT,
			allowNull: true,
			defaultValue: JSON.stringify({
				min: 0,
				max: 0,
			}),
			get() {
				const rawValue = this.getDataValue('required_exp');
				return rawValue ? JSON.parse(rawValue) : {};
			},
			set(value: RequiredExperience) {
				this.setDataValue('required_exp', JSON.stringify(value));
			},
		},
		salary: {
			type: DataTypes.TEXT, 
			allowNull: true,
			defaultValue: JSON.stringify({
				min: 0,
				max: 0,
			}),
			get() {
				const rawValue = this.getDataValue('salary');
				return rawValue ? JSON.parse(rawValue) : {};
			},
			set(value: SalaryRange) {
				this.setDataValue('salary', JSON.stringify(value));
			},
		},
		website_link: {
			type: DataTypes.STRING,
			allowNull: true,
		},
	},
	{
		sequelize,
		modelName: 'Job',
		tableName: 'jobs',
	}
);

JobModel.belongsTo(UserModel, {
	foreignKey: "publisher_id",
	as: "posted_by",
	targetKey: "id"

})

export {sequelize, JobModel };
