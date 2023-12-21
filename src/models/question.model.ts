import sequelize from "@configs/db";
import {
	QuestionAttributes,
} from "@interfaces/question.Types"; 
import { Model, DataTypes } from "sequelize";

class QuestionModel
	extends Model<QuestionAttributes>
	implements QuestionAttributes
{
	public id!: number;
	public text!: string;
	public poll_id!: number;
	public options!: any;


}


QuestionModel.init(
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement:true,
			allowNull: false,
		},
		text: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		poll_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		options: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: []
    },
		
	},
	
	{
		sequelize,
		modelName: "Question",
		tableName: "questions",
	},
);


export {sequelize,QuestionModel}