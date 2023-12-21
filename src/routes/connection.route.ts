import { Router } from "express";
import { Routes } from "@interfaces/routes.interface";
import ConnectionController from "@controllers/connection.controller";
import { ensureAuth } from "@middlewares/auth.middleware";

class ConnectionRoute implements Routes {
    public path = "/connections";
    public router = Router();
    public connectionController = new ConnectionController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {

        this.router.get(this.path, ensureAuth, this.connectionController.getAllConnections);

        // Send a connection request from user1 to user2
        this.router.post(`${this.path}/send-request/:user2Id`, ensureAuth, this.connectionController.sendConnectionRequest);

        // Accept a connection request from user1 to user2
        this.router.put(`${this.path}/accept-request/:user2Id`, ensureAuth, this.connectionController.acceptConnectionRequest);

        // Reject a connection request from user1 to user2
        this.router.delete(`${this.path}/reject-request/:user2Id`, ensureAuth, this.connectionController.rejectConnectionRequest);
    }
}

export default ConnectionRoute;
