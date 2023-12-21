import { Router } from "express";
import { Routes } from "@interfaces/routes.interface";
import VentureController from "@controllers/venture.controller";

class VentureRoute implements Routes {
    public path = "/ventures";
    public router = Router();
    public ventureController = new VentureController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(this.path, this.ventureController.getAllVentures);
        this.router.get(`${this.path}/:id`, this.ventureController.getVentureById);
        this.router.post(this.path, this.ventureController.createVenture);
        this.router.patch(`${this.path}/:id`, this.ventureController.updateVenture);
        this.router.delete(`${this.path}/:id`, this.ventureController.deleteVenture);
    }
}

export default VentureRoute;
