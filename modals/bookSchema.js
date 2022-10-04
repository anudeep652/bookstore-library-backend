import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  likes: Number,
  payAmount: {
    type: Number,
    required: true,
  },
  rentAmount: {
    type: Number,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },

  reviews: [
    {
      reviewer: {
        type: String,
        required: true,
      },
      subject: String,
      message: String,
      date: {
        type: Date,
        default: Date.now(),
      },
      stars: {
        type: Number,
        default: 0,
      },
    },
  ],
});

export default mongoose.model("Book", bookSchema);
