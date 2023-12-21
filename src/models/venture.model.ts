import { DataTypes, Model } from "sequelize";
import sequelize from "@configs/db";
import { VentureAttributes, VentureStatus } from "@interfaces/ventureTypes";
import { UserModel } from "./user.model";

class VentureModel extends Model<VentureAttributes> implements VentureAttributes {
    public id!: number;
    public venture_owner!: number;
    public venture_founders!: string[];
    public venture_name!: string;
    public venture_description!: string;
    public website_link!: string | null;
    public contact_info!: string[];
    public Industry!: string;
    public founding_date!: Date;
    public current_status!: VentureStatus;
    public Socials!: string[];
    public financial_status!: string;
    public number_of_employee!: number;
    public static associate = (): void => {

        VentureModel.belongsTo(UserModel, {
            foreignKey: 'venture_owner',
            as: 'owner',
        });
    };
}

VentureModel.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
    },
    venture_owner: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    venture_founders: {
        type: DataTypes.JSON,
        allowNull: true,
    },
    venture_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    venture_description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    website_link: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    contact_info: {
        type: DataTypes.JSON,
        allowNull: true,
    },
    Industry: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    founding_date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    current_status: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    Socials: {
        type: DataTypes.JSON,
        allowNull: true,
    },
    financial_status: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    number_of_employee: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    sequelize,
    modelName: "Venture",
    tableName: "ventures"
});

VentureModel.associate()
export { sequelize, VentureModel };
