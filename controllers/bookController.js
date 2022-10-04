import Book from "../modals/bookSchema.js";

// * @desc    get all books
// * @route   get /books/
// * @access  Public
export const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find({});
    return res.status(200).json({ books: books });
  } catch (error) {
    return res.status(400).json({ error: error });
  }
};
