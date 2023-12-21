import { Model, DataTypes, Association } from 'sequelize';
import sequelize from '@configs/db';
import { UserModel } from './user.model';
import { LikeModel } from './like.model';
import { CommentModel } from './comment.model';
import { Post, attachmentType, postType } from '@interfaces/posts.interface';
import { Like } from '@interfaces/likes.interface';
import { Comment } from '@interfaces/comment.interface';

class PostModel extends Model<Post> implements Post {
    public id!: number;
    public title?: string;
    public content!: string;
    public attachments?: attachmentType[];
	public postType: postType;
    public created_by!:number;
    public likes?: Like[];
    public comments?: Comment[];

    public static associations: {
        likes: Association<PostModel, LikeModel>;
        comments: Association<PostModel, CommentModel>;
    };
}

PostModel.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        postType: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        content: {
            type: DataTypes.STRING,
            allowNull: false,
        },
		attachments: {
			type: DataTypes.JSON,
			allowNull: true,
			defaultValue: [],
		},
        created_by: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: 'Post',
        tableName: 'posts',
    }
);

PostModel.hasMany(LikeModel, { foreignKey: 'postedId', as: 'likes' });
PostModel.hasMany(CommentModel, { foreignKey: 'postId', as: 'comments' });

PostModel.belongsTo(UserModel, {
    foreignKey: "created_by",
    as: "posted_by",
    targetKey: "id"
});

export { sequelize, PostModel };
