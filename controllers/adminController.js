import mongoose from "mongoose";
import User from "../modals/userSchema.js";
import { generateJwt } from "./userController.js";
import bcrypt from "bcryptjs";
import Book from "../modals/bookSchema.js";

export const login = async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);

  try {
    const user = await User.findOne({ email: email });
    if (!user) return res.status(400).json({ error: "no user found" });
    if (await bcrypt.compare(password, user.password)) {
      const isAdmin = user.role === "admin";
      if (!isAdmin)
        return res
          .status(400)
          .json({ error: "You do not have admin permissions" });

      res
        .status(200)
        .json({ username: user.username, token: generateJwt(user._id) });
    }
  } catch (error) {
    return res.status(400).json({ error: error });
  }
};

// * @desc    post a books
// * @route   post /book/
// * @access  private(only by admin)

export const registerABook = async (req, res) => {
  const { bookName, authorName, buyAmount, rentAmount, imageUrl, description } =
    req.body;
  console.log(bookName, authorName);
  try {
    await Book.create({
      name: bookName,
      author: authorName,
      payAmount: buyAmount,
      rentAmount,
      imageUrl,
      description,
    });
    return res.status(201).json({ message: "Successfully created the book" });
  } catch (error) {
    return res.status(400).json({ error: error });
  }
};
