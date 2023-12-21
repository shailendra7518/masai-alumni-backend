import sequelize from '@configs/db';
import { SpotlightAttributes, CategorieType } from '@interfaces/spotLight';
import { Model, DataTypes } from 'sequelize';
import { UserModel } from './user.model';


class spotLightModel extends Model<SpotlightAttributes> implements SpotlightAttributes {
    public spotlight_id!: number;
    public spotlight_title!: string;
    public spotlight_description!: string;
    public spotlight_image!: string;
    public spotlight_video!: string;
    public Categories:CategorieType;
    public created_by!:number;
    public related_links!:string[];

  }


  spotLightModel.init(
        {
            spotlight_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            spotlight_title: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            spotlight_description: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            spotlight_image: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            spotlight_video: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            Categories:{
                type: DataTypes.STRING,
                allowNull: false,
            },
            created_by: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },

            related_links: {
                type: DataTypes.JSON,
                allowNull: true,
            },
        },
        {
            sequelize,
            modelName: 'spotlight',
            tableName: 'spotlights',
            timestamps: true,
        }
    );

    spotLightModel.belongsTo(UserModel, {
        foreignKey: "created_by",
        as: "posted_by",
        targetKey: "id"

    })

export { sequelize, spotLightModel };


