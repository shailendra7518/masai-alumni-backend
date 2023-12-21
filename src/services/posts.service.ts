import { PostModel } from '@models/posts.model';
import { Post } from '@interfaces/posts.interface';
import { CommentModel } from '@models/comment.model';
import { LikeModel } from '@models/like.model';
import { UserModel } from '@models/user.model';
import { HttpException } from "@exceptions/HttpException";


class PostService {
    public createPost = async (postData: Partial<Post>): Promise<PostModel> => {
        try {
            const newPost = await PostModel.create(postData);
            const createdPost = await PostModel.findByPk(newPost.id, {
                include: [
                    {
                        model: CommentModel,
                        as: 'comments',
                        include: [
                            {
                                model: UserModel,
                                as: 'commented_by',
                            },
                        ],
                    },
                    {
                        model: LikeModel,
                        as: 'likes',
                        include: [
                            {
                                model: UserModel,
                                as: 'liked_by',
                            },
                        ],
                    },
                    {
						model: UserModel,
                        as: "posted_by",

					},
                ],
            });

            return createdPost;
        } catch (error) {
			throw new HttpException(500, 'Unable to fetch post');
        }
    }

    public getAllPosts = async (): Promise<PostModel[]> => {
        try {
            const posts = await PostModel.findAll({
                include: [
                    {
                        model: CommentModel,
                        as: 'comments',
                        include: [
                            {
                                model: UserModel,
                                as: 'commented_by',
                            },
                        ],
                    },
                    {
                        model: LikeModel,
                        as: 'likes',
                        include: [
                            {
                                model: UserModel,
                                as: 'liked_by',
                            },
                        ],
                    },
                    {
						model: UserModel,
                        as: "posted_by",

					},
                ],
				order: [['createdAt', 'DESC']]
            });

            return posts;
        } catch (error) {
			throw new HttpException(500, 'Unable to fetch post');
        }
    }

    public getPostById = async (postId: number): Promise<PostModel | null> => {
        try {
            const post = await PostModel.findByPk(postId, {
                include: [
                    {
                        model: CommentModel,
                        as: 'comments',
                        include: [
                            {
                                model: UserModel,
                                as: 'commented_by',
                            },
                        ],
                    },
                    {
                        model: LikeModel,
                        as: 'likes',
                        include: [
                            {
                                model: UserModel,
                                as: 'liked_by',
                            },
                        ],
                    },
                    {
						model: UserModel,
                        as: "posted_by",

					},
                ],
            });

            return post || null;
        } catch (error) {
			throw new HttpException(500, 'Error fetching post');
        }
    }

    public updatePost = async (
        userId: number,
        postId: number,
        updatedData: Partial<Post>
    ): Promise<[number, PostModel[]]> => {
        try {
            const post = await PostModel.findOne({ where: { id: postId } });

            if (!post) {
                throw new HttpException(404, 'Post not found');
            }

            if (post.dataValues.created_by !== userId) {
                throw new HttpException(403, 'You are not authorized to update this post');
            }

            const [updatedRowsCount, updatedPosts] = await PostModel.update(updatedData, {
                where: { id: postId },
                returning: true,
            });

            return [updatedRowsCount, updatedPosts];
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            } else {
                throw new HttpException(500, 'Unable to update post');
            }
        }
    };

    public deletePost = async (userId: number, postId: number): Promise<number> => {
        try {
            const post = await PostModel.findOne({ where: { id: postId } });

            if (!post) {
                throw new HttpException(404, 'Post not found');
            }

            if (post.dataValues.created_by !== userId) {
                throw new HttpException(403, 'You are not authorized to delete this post');
            }

            const deletedRowsCount = await PostModel.destroy({ where: { id: postId } });

            return deletedRowsCount;
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            } else {
                throw new HttpException(500, 'Unable to delete post');
            }
        }
    };

    public likePost = async (postId: number, userId: number): Promise<PostModel | null> => {
        try {

            const existingLike = await LikeModel.findOne({
                where: {
                    postedId: postId,
                    userId: userId,
                },
            });

            if (existingLike) {
                throw new HttpException(400, 'You have already liked this post');
            }
            await LikeModel.create({
                postedId: postId,
                userId: userId,
            });

            const updatedPost = await PostModel.findByPk(postId, {
                include: [
                    {
                        model: CommentModel,
                        as: 'comments',
                        include: [
                            {
                                model: UserModel,
                                as: 'commented_by',
                            },
                        ],
                    },
                    {
                        model: LikeModel,
                        as: 'likes',
                        include: [
                            {
                                model: UserModel,
                                as: 'liked_by',
                            },
                        ],
                    },
                    {
						model: UserModel,
                        as: "posted_by",

					},
                ],
            });

            return updatedPost || null;
        } catch (error) {
			throw new HttpException(500, error.message);
        }
    }

    public unlikePost = async (postId: number, likeId: number): Promise<PostModel | null> => {
        try {
            const deletedLike = await LikeModel.findByPk(likeId);
            if (deletedLike) {
                await deletedLike.destroy();
            }

            const updatedPost = await PostModel.findByPk(postId, {
                include: [
                    {
                        model: CommentModel,
                        as: 'comments',
                        include: [
                            {
                                model: UserModel,
                                as: 'commented_by',
                            },
                        ],
                    },
                    {
                        model: LikeModel,
                        as: 'likes',
                        include: [
                            {
                                model: UserModel,
                                as: 'liked_by',
                            },
                        ],
                    },
                    {
						model: UserModel,
                        as: "posted_by",

					},
                ],
            });

            return updatedPost || null;
        } catch (error) {
			throw new HttpException(500, 'Error while unliking post');
        }
    }

    public createComment = async (postId: number, userId: number, body: string): Promise<PostModel | null> => {
        try {
            await CommentModel.create({
                postId: postId,
                userId: userId,
                body: body,

            });

            //console.log(createdComment.toJSON());

            const updatedPost = await PostModel.findByPk(postId, {
                include: [
                    {
                        model: CommentModel,
                        as: 'comments',
                        include: [
                            {
                                model: UserModel,
                                as: 'commented_by',
                            },
                        ],
                    },
                    {
                        model: LikeModel,
                        as: 'likes',
                        include: [
                            {
                                model: UserModel,
                                as: 'liked_by',
                            },
                        ],
                    },
                    {
						model: UserModel,
                        as: "posted_by",

					},
                ],
            });

            return updatedPost || null;
        } catch (error) {
			throw new HttpException(500, 'Error while creating comment');
        }
    }

    public deleteComment = async (userId: number,commentId: number, postId: number): Promise<PostModel | null> => {
        try {
            const deletedComment = await CommentModel.findByPk(commentId);
            if (!deletedComment) {
                throw new HttpException(404, 'Comment not found');
            }

            if (deletedComment.dataValues.userId !== userId) {
                throw new HttpException(403, 'You are not authorized to delete this comment');
            }

            await deletedComment.destroy();

            const updatedPost = await PostModel.findByPk(postId, {
                include: [
                    {
                        model: CommentModel,
                        as: 'comments',
                        include: [
                            {
                                model: UserModel,
                                as: 'commented_by',
                            },
                        ],
                    },
                    {
                        model: LikeModel,
                        as: 'likes',
                        include: [
                            {
                                model: UserModel,
                                as: 'liked_by',
                            },
                        ],
                    },
                    {
                        model: UserModel,
                        as: 'posted_by',
                    },
                ],
            });

            return updatedPost || null;
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            } else {
                throw new HttpException(500, 'Error while deleting comment');
            }
        }
    }

}

export { PostService };
