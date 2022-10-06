import emailValidator from "email-validator";
import User from "../modals/userSchema.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Book from "../modals/bookSchema.js";
import { sendMail } from "../utils/sendMail.js";

//validating email function
const validateEmail = (email) => {
  return emailValidator.validate(email);
};

//generate jwt token
export const generateJwt = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// * @desc    Register new user
// * @route   POST /user/register
// * @access  Public
export const registerUser = async (req, res) => {
  const { username, email, password, confirmPassword, role } = req.body;

  //checking if any field is empty
  if (!email || !username || !password || !confirmPassword) {
    return res.status(400).json({ error: "Please fill all the fields " });
  }

  //checking if the user already exists
  const userExists = await User.findOne({ username: username });
  if (userExists) {
    return res.status(400).json({ message: "This username already exists" });
  }
  const userEmailExists = await User.findOne({ email: email });
  if (userExists) {
    return res.status(400).json({ message: "This email already exists" });
  }

  //validating email
  if (validateEmail(email)) {
    //checking if password and confirm password are same
    if (password === confirmPassword) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      try {
        const user = await User.create({
          username,
          email,
          password: hashedPassword,
          role: role,
        });

        if (user) {
          return res.status(201).json({
            username,
            email,
            token: generateJwt(user._id),
            boughtBooks: user.boughtBooks,
            rentedBooks: user.rentedBooks,
          });
        }
      } catch (error) {
        return res.status(400).json({ message: "It is an error" });
      }
    }

    return res.status(400).json({ message: "Passwords doesn't match" });
  }

  return res.status(400).json({ message: "Invalid email" });
};

// * @desc    Login  user
// * @route   POST /user/login
// * @access  Public
export const login = async (req, res) => {
  const { email, password } = req.body;
  //checking if any field is empty
  if (!email || !password) {
    return res.status(400).json({ message: "Please fill all the fields " });
  }

  //checking if the user  exists
  const userExists = await User.findOne({ email: email });

  if (userExists) {
    if (await bcrypt.compare(password, userExists.password)) {
      return res.status(200).json({
        username: userExists.username,
        email: userExists.email,
        token: generateJwt(userExists._id),
        boughtBooks: userExists.boughtBooks,
        rentedBooks: userExists.rentedBooks,
      });
    }
    return res.status(400).json({ message: "Invalid password" });
  }
  return res.status(400).json({ message: "No user with this email found" });
};

//buy book

// * @desc    Buy a book
// * @route   POST /:bookName/buy
// * @access  Private
export const buyBook = async (req, res) => {
  const { bookName } = req.params;

  const book = await Book.findOne({ name: bookName });
  if (!book) return res.status(400).json({ error: "No book found" });

  try {
    const user = await User.findOne({ _id: req.user._id });
    user.boughtBooks.push(bookName);

    await user.save();
    try {
      sendMail(user, bookName);
      return res
        .status(200)
        .json({ message: "Mail sent successfully", book: bookName });
    } catch (error) {
      return res.status(400).json({ error });
    }
  } catch (error) {
    return res.status(400).json({ error: error });
  }
};

//rent book

// * @desc    Rent a book
// * @route   POST /:bookName/rent
// * @access  Private
export const rentBook = async (req, res) => {
  const { bookName } = req.params;

  const book = await Book.findOne({ name: bookName });
  if (!book) return res.status(400).json({ error: "No book found" });

  try {
    const user = await User.findOne({ _id: req.user._id });
    user.rentedBooks.push(bookName);

    await user.save();
    try {
      sendMail(user, bookName);
      return res
        .status(200)
        .json({ message: "Mail sent successfully", book: bookName });
    } catch (error) {
      return res.status(400).json({ error });
    }
  } catch (error) {
    return res.status(400).json({ error: error });
  }
};

// { bookName:String,subject:String,message:string}
export const review = async (req, res) => {
  const { bookName, review, stars } = req.body;
  // console.log(req.body);
  const book = await Book.findOne({ name: bookName });
  const user = await User.findOne({ username: req.user.username });
  try {
    book.reviews.push({
      reviewer: req.user.username,
      subject: review.subject,
      message: review.message,
      stars: stars,
    });

    user.reviewsMade.push({
      bookName: bookName,
      subject: review.subject,
      message: review.message,
    });

    await book.save();
    await user.save();
    return res.status(200).json({
      message: "Successfully reviewed",
      bookName,
      review: {
        date: new Date().toLocaleDateString(),
        message: review.message,
        reviewer: user.username,
        subject: review.subject,
        stars: stars,
      },
    });
  } catch (error) {
    return res.status(400).json({ error: error });
  }
};

export const contact = async (req, res) => {
  const { email, subject, message } = req.body;
  // console.log(req.body);
  // console.log(email, subject, message);

  try {
    await sendMail(process.env.ADMIN_EMAIL, "", true, email, subject, message);
    return res.status(200).json({ message: "Successfully sent Mail" });
  } catch (error) {
    return res.status(400).json({ error: error });
  }
};
