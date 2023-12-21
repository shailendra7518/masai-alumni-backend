import sequelize from '@configs/db';
import { Comment } from '@interfaces/comment.interface';
import { Model, DataTypes } from 'sequelize';
import { UserModel } from './user.model';

class CommentModel extends Model<Comment> implements Comment {

    public id!: number;
    public userId!: number;
    public postId!: number;
    public body!: string;

}

CommentModel.init(
  {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    postId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    body: {
        type: DataTypes.STRING,
        allowNull: false,
    },


  },
  {
    sequelize,
    modelName: 'comment',
    tableName: 'comments',
	timestamps: true
  }
);
CommentModel.belongsTo(UserModel, {
    foreignKey: "userId",
    as: "commented_by",
    targetKey: "id"

})


export { sequelize, CommentModel };
