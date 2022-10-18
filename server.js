dotenv.config();
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import { authorizeUser } from "./middleware/auth.js";
import userRoutes from "./routes/userRoutes.js";
import bookRoutes from "./routes/bookRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import cors from "cors";
import {
  buyBook,
  contact,
  rentBook,
  review,
} from "./controllers/userController.js";
import { adminMiddleWare } from "./middleware/admin.js";

//initializing express app
const app = express();
const PORT = process.env.PORT || 5000;

//middle wares
app.use(express.json());
app.use(
  cors({
    origin: [process.env.FRONTEND_URL, process.env.ADMIN_FRONTEND_URL],
    optionsSuccessStatus: 200,
    credentials: true,
  })
);

// user routes
app.use("/user/", userRoutes);
app.use("/book", bookRoutes);
app.post("/:bookName/buy", authorizeUser, buyBook);
app.post("/:bookName/rent", authorizeUser, rentBook);
app.post("/:bookName/writeReview", authorizeUser, review);
app.post("/contact", contact);

// admin routes
app.use("/admin", adminRoutes);

// database connection
const connection = async () => {
  await mongoose.connect(process.env.MONGO_URI);
};
connection();

app.listen(PORT, () => console.log(`Server is Listening on port ${PORT}`));
