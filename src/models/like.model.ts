import sequelize from '@configs/db';
import { Like } from '@interfaces/likes.interface';
import { Model, DataTypes } from 'sequelize';
import { UserModel } from './user.model';

class LikeModel extends Model<Like> implements Like {

  public likeId!: number;
  public userId!: number;
  public postedId!: number;

}

LikeModel.init(
  {

    likeId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    postedId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },

  },
  {
    sequelize,
    modelName: 'like',
    tableName: 'likes',
    timestamps: false,
  }
);

LikeModel.belongsTo(UserModel, {
    foreignKey: "userId",
    as: "liked_by",
    targetKey: "id"
})



export { sequelize, LikeModel };
