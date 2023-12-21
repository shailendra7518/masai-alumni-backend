import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import { HOFController } from '@controllers/HOF.controller';
import { ensureAuth } from '@middlewares/auth.middleware';


class HOFRoute implements Routes {
  public path = '/hofs';
  public router = Router();
  public hofController = new HOFController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(this.path,ensureAuth, this.hofController.createHOF);
    this.router.get(this.path, ensureAuth, this.hofController.getAllHOFEntries);
    this.router.get(`${this.path}/:id`, ensureAuth, this.hofController.getHOFEntryById);
    this.router.put(`${this.path}/:id`,ensureAuth, this.hofController.updateHOFEntry);
    this.router.delete(`${this.path}/:id`,ensureAuth, this.hofController.deleteHOFEntry);


   
  }
}

export default HOFRoute;
