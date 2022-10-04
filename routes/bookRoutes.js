import express from "express";
import { getAllBooks } from "../controllers/bookController.js";
import { adminMiddleWare } from "../middleware/admin.js";
const router = express.Router();

router.route("/").get(getAllBooks);

export default router;
