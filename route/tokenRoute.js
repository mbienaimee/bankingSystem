import tokenController from "../controller/token.controller.js";
import { Router } from "express";
const router = Router();

router.post("/add", tokenController.addToken);
router.get("/findByUser", tokenController.findByUser);
router.delete("/delete", tokenController.deleteToken);

export default router;
