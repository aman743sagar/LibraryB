const mongoose=require('mongoose')

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },

  author: {
    type: String,
    required: true,
    trim: true
  },

  category: {
    type: String,
    required: true,
    trim: true
  },

  isbn: {
    type: String,
    unique: true,
    required: true
  },

  availableCopies: {
    type: Number,
    default: 1,
    min: 0
  },

  totalCopies: {
    type: Number,
    default: 1,
    min: 0
  }
}, { timestamps: true });

const Book=mongoose.model("Book", bookSchema)
module.exports=Book
