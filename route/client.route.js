import { Router } from "express";
const routerClient = Router();
import clientController from "../controller/client.controller.js";

import adminMiddleware from "../middleware/admin.middleware.js";

routerClient.post("/add",adminMiddleware,clientController.clientCreation);
routerClient.get("/listClient", adminMiddleware, clientController.clientList);
routerClient.post("/loginclient",clientController.login)

export default routerClient;
