import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import { PostController } from '@controllers/post.controller';
import { ensureAuth } from '@middlewares/auth.middleware';


class JobRoute implements Routes {
  public path = '/posts';
  public router = Router();


  public postController = new PostController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {

    this.router.post(`${this.path}/create`, ensureAuth, this.postController.createPost);
    this.router.get(`${this.path}/:id`, ensureAuth, this.postController.getPostById);
    this.router.delete(`${this.path}/:id`, ensureAuth, this.postController.deletePost);
    this.router.get(this.path, ensureAuth, this.postController.getAllPosts);
    this.router.put(`${this.path}/:id`, ensureAuth, this.postController.updatePost);

    this.router.post(`${this.path}/like`, ensureAuth, this.postController.likePost);
    this.router.post(`${this.path}/unlike`, ensureAuth, this.postController.unlikePost);

    this.router.post(`${this.path}/addComment`, ensureAuth, this.postController.createComment);
    this.router.post(`${this.path}/deleteComment`, ensureAuth, this.postController.deleteComment);

  }
}

export default JobRoute;
