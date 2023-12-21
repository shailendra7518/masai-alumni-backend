import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import  {SpotlightController}  from '@controllers/spotlight.controller';
import { ensureAuth } from '@middlewares/auth.middleware';

class SpotlightRoute implements Routes {
    public path = '/spotlight';
    public router = Router();
    public spotlightController = new SpotlightController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {

        // Public route
        this.router.get(`${this.path}/:id`,ensureAuth, this.spotlightController.getSpotlightById);

        this.router.delete(`${this.path}/:id`,ensureAuth, this.spotlightController.deleteSpotlight);

        this.router.post(this.path, ensureAuth, this.spotlightController.createSpotlight);

        this.router.get(this.path,ensureAuth, this.spotlightController.getAllSpotlights);

        this.router.put(`${this.path}/:id`,ensureAuth, this.spotlightController.updateSpotlight);


    }
}

export default SpotlightRoute;
