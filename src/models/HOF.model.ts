import sequelize from '@configs/db';
import { HOFAttributes } from '@interfaces/HOF.interface';
import { Model, DataTypes } from 'sequelize';
import { UserModel } from './user.model';

class HOFModel extends Model<HOFAttributes> implements HOFAttributes {
    public Id!: number;
    public image!: string;
    public title!: string;
    public subtitle!: string;
    public userId!: number;
    public created_by!: number;

}

HOFModel.init(
    {
        Id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        image: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        title: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        subtitle: {
            type: DataTypes.STRING(15),
            allowNull: false,

        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,

        },
        created_by: {
            type: DataTypes.INTEGER,
            allowNull: false,

        },
    },
    {
        sequelize,
        modelName: 'hof',
        tableName: 'hofs',
        timestamps: false,
    }
);
HOFModel.belongsTo(UserModel, {
	as: "HOF_user",
	foreignKey: "userId",
	targetKey: "id",
});

HOFModel.belongsTo(UserModel, {
	as: "HOF_userCreatedBy",
	foreignKey: "created_by",
	targetKey: "id",
});
export { sequelize, HOFModel };
