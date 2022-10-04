import express from "express";
import { login, registerABook } from "../controllers/adminController.js";
import { adminMiddleWare } from "../middleware/admin.js";
const router = express.Router();

router.post("/login", login);
router.post("/createbook", adminMiddleWare, registerABook);

export default router;
