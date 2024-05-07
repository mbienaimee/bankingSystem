import userController from "../controller/user.controller.js";
import adminMiddleware from "../middleware/admin.middleware.js";
import userMiddleware from "../middleware/user.middleware.js";
 import { usercreateValidations,loginusers } from "../middleware/validation.js";
 import accountController from "../controller/account.controller.js";
import { Router } from "express";
const route = Router();

route.post("/register",usercreateValidations,userController.signup);
route.post("/login",loginusers, userController.login);

route.post("/verify",userController.ValidateOpt)
route.get("/list", adminMiddleware, userController.allUser);
route.get("/list/:id", userController.listByid);
route.delete("/user/:id", userMiddleware, userController.Deleting);
route.delete("/user/:id", adminMiddleware, userController.Deleting);
route.put("/user/update/:id", userController.updating);
// route.post("/account", adminMiddleware, accountController.accCreation)

export default route;
