import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import { JobController } from '@controllers/job.controller';
import { ensureAuth } from '@middlewares/auth.middleware';


class JobRoute implements Routes {
  public path = '/jobs';
  public router = Router();
  public jobController = new JobController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(this.path, ensureAuth, this.jobController.getAllJobs);
    this.router.get(`${this.path}/:id`, ensureAuth, this.jobController.getJobById);
    this.router.post(this.path, ensureAuth, this.jobController.createJob);
    this.router.put(`${this.path}/:id`, ensureAuth, this.jobController.updateJob);
    this.router.delete(`${this.path}/:id`, ensureAuth, this.jobController.deleteJob);
  }
}

export default JobRoute;
