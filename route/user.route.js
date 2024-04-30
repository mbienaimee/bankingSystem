import userController from "../controller/user.controller.js";
import adminMiddleware from "../middleware/admin.middleware.js";
import userMiddleware from "../middleware/user.middleware.js";
// import { userValidations } from "../middleware/validation.js";
import { Router } from "express";
const route = Router();

route.post("/register",userController.signup);
route.post("/login", userController.login);
route.post("/verify",userController.ValidateOpt)
route.get("/list", adminMiddleware, userController.allUser);
route.get("/list/:id", userController.listByid);
route.delete("/user/:id", userMiddleware, userController.Deleting);
route.delete("/user/:id", adminMiddleware, userController.Deleting);
route.put("/user/update/:id", userController.updating);

export default route;
