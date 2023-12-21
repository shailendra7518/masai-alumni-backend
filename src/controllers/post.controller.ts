import { Request, Response, NextFunction } from 'express';
import { PostService } from '@services/posts.service';
import { HttpException } from '@exceptions/HttpException';
import { CustomRequest } from '@interfaces/CustomRequest';
import { NoticeService } from '@services/notice.service';
class PostController {
	private postService = new PostService();
	private noticeService = new NoticeService();
	public createPost = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
		try {
			const { title, content, attachments, postType } = req.body;
			const id = Number(req.user.id);

			if (!title || !content || !postType) {
				res.status(400).json({ error: 'Title, postType and content are required fields' });
				return;
			}

			const postData = {
				title,
				content,
				attachments,
				postType
			};
			const newPost = await this.postService.createPost({ ...postData, created_by: id });

			if (postType === "announcement") {
				await this.noticeService.createNotice({
					attachmentId: newPost.dataValues.id,
					category: "announcement",
					authorId: id
				});
			}


			res.status(201).json({ success: true, data: newPost });
		} catch (error) {
			next(error);
		}
	}

	public getAllPosts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		try {
			const posts = await this.postService.getAllPosts();

			res.status(200).json({ success: true, data: posts });
		} catch (error) {
			next(error);

		}
	}

	public getPostById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		try {
			const postId = Number(req.params.id);
			const post = await this.postService.getPostById(postId);

			if (!post) {
				throw new HttpException(404, "Post not found");

			}

			res.status(200).json({ success: true, data: post });
		} catch (error) {
			next(error);

		}
	}

	public updatePost = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
		try {
			const userId = Number(req.user.id);
			const postId = Number(req.params.id);
			const { title, content, image } = req.body;

			if (!title || !content) {
				res.status(400).json({ error: 'Title and content are required fields' });
				return;
			}

			const postData = {
				title,
				content,
				image,
			};

			const [updatedRowsCount, updatedPosts] = await this.postService.updatePost(userId, postId, postData);

			if (updatedRowsCount === 0) {
				throw new HttpException(404, 'post not found or Unauthorized: You are not the creator of this spotlight');
			} else {
				res.status(200).json({ message: 'Post is updated', updatedPosts });
			}
		} catch (error) {
			next(error);
		}
	};

	public deletePost = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
		try {
			const postId = Number(req.params.id);

			const deletedRowsCount = await this.postService.deletePost(req.user.id, postId);

			if (deletedRowsCount === 0) {
				throw new HttpException(404, "Post not found");
			} else {
				await this.noticeService.deleteNoticebyAttachmentID(postId, "announcement")
				res.status(200).json({
					message: "Poll deleted successfully",
				});

			}
		} catch (error) {
			next(error);
		}
	};


	public likePost = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
		try {

			const { postId } = req.body;
			const userId = Number(req.user.id);

			const updatedPost = await this.postService.likePost(postId, userId);

			if (!updatedPost) {
				throw new HttpException(404, 'Post not found');
			}

			res.status(200).json({ success: true, data: updatedPost });
		} catch (error) {
			next(error);

		}
	}

	public unlikePost = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		try {
			const { postId, likeId } = req.body;

			const updatedPost = await this.postService.unlikePost(postId, likeId);

			if (!updatedPost) {
				throw new HttpException(404, 'Spotlight not found');

			}

			res.status(200).json({ success: true, data: updatedPost });
		} catch (error) {
			next(error);

		}
	}

	public createComment = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
		try {
			const { postId, body } = req.body;
			const userId = Number(req.user.id);

			const updatedPost = await this.postService.createComment(postId, userId, body);

			if (!updatedPost) {
				throw new HttpException(404, 'Post not found');

			}

			res.status(201).json({ success: true, data: updatedPost });
		} catch (error) {
			next(error);

		}
	}

	public deleteComment = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
		try {
			const { commentId, postId } = req.body;
			const userId = Number(req.user.id);



			const updatedPost = await this.postService.deleteComment(userId, commentId, postId);

			if (!updatedPost) {
				throw new HttpException(404, 'Comment not found or Unauthorized: You are not the creator of this comment');
			}

			res.status(200).json({ success: true, data: updatedPost });
		} catch (error) {
			next(error);
		}
	}
}

export { PostController };
