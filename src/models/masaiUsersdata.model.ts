import sequelize from '@configs/db';
import { MasaiUserAttributes } from '@interfaces/masaiUsersData';
import { Model, DataTypes } from 'sequelize';

class MasaiUserModel extends Model<MasaiUserAttributes> implements MasaiUserAttributes {
  public name!: string;
  public email!: string;
  public mobile!: string;
  public password!: string;
  public role!: string;
  public profile_photo_path!: string;


  
}

MasaiUserModel.init(
  {

    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    mobile: {
      type: DataTypes.STRING(255),
    },
    password: {
      type: DataTypes.STRING(255),
    },
    role: {
      type: DataTypes.STRING(255),
    },
    profile_photo_path: {
      type: DataTypes.STRING(255),
    },

  },
  {
    sequelize,
    modelName: 'masaiuser',
    tableName: 'masaiusers',
    timestamps: false,
  }
);

export { sequelize, MasaiUserModel };
