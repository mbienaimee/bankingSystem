import accountController from "../controller/account.controller.js";
import adminMiddleware from "../middleware/admin.middleware.js";
import userMiddleware from "../middleware/user.middleware.js"



import { Router } from "express";
const route = Router()

route.post("/addacc",adminMiddleware,accountController.accCreation);
route.put("/update/:id",adminMiddleware,accountController.updating)
route.delete("/delete",adminMiddleware,accountController.deleteAccount)
route.get("/list",adminMiddleware,accountController.accList)
route.get("/userbyId/:id",userMiddleware,accountController.accById)
route.post("/transfer",userMiddleware,accountController.transferFunds)
route.post("/deposit",userMiddleware,accountController.depositFunds)
route.post("/withdraw",userMiddleware,accountController.withdrawFunds)

export default route;