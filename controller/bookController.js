const Book= require('../Models/book');
const User = require('../Models/user');

const addBook=async(req,res)=>{
    try {
       const { title, author, category, isbn, totalCopies } = req.body;
       if (!title || !author || !category || !isbn || !totalCopies)
      return res.status(400).json({ message: "All fields are required" });
     const existingBook = await Book.findOne({ isbn });
     if (existingBook) return res.status(400).json({ message: "Book with this ISBN already exists" });
     const newBook = new Book({
      title,
      author,
      category,
      isbn,
      totalCopies,
      availableCopies: totalCopies,
    });
    await newBook.save();
    res.status(201).json({ message: "Book added successfully", book: newBook });
    } catch (error) {
    res.status(500).json({ message: "Failed to add book", error: error.message });
    }
}
const getAllBook=async (req,res)=>{
    try {
        const allBook=await Book.find()
        // console.log(allBook);
        res.json(allBook)
    } catch (error) {
          res.status(500).json({ message: "Failed to fetch books", error: error.message });
    }
}
const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });
    // console.log(book);
      const borrowers = await User.find({ "borrowBook.bookId": req.params.id })
      .select("name email borrowBook")
      .populate("borrowBook.bookId", "title author isbn");

    res.json({ book, borrowers });
    // res.json(book);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to fetch book", error: error.message });
  }
};

const updateBook=async(req,res)=>{
    try {
        const { title, author, category, isbn, totalCopies, availableCopies } = req.body;
        const updatebook=await Book.findByIdAndUpdate(req.params.id,{ title, author, category, isbn, totalCopies, availableCopies:totalCopies }, { new: true })
         if (!updatebook) return res.status(404).json({ message: "Book not found" });
          res.json({ message: "Book updated successfully", book: updatebook });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Failed to update book", error: error.message });
    }
}
const deleteBook = async (req, res) => {
  try {
    const deletedBook = await Book.findByIdAndDelete(req.params.id);
    if (!deletedBook) return res.status(404).json({ message: "Book not found" });
    res.json({ message: "Book deleted successfully", deletedBook });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete book", error: error.message });
  }
};

const issueBook=async(req,res)=>{
    try {
        const {userId, bookId}=req.params;
        const user=await User.findById(userId)
        if(!user) return res.status(400).json({message:"user not found"})
        const book = await Book.findById(bookId);
        if (!book) return res.status(404).json({ message: "Book not found" });
        if (book.availableCopies < 1)
        return res.status(400).json({ message: "Book is not available" });
        user.borrowBook.push({bookId:book._id,borrowDate:new Date})
         await user.save()
          book.availableCopies -= 1;
          await book.save();
        res.json({ message: "Book issued successfully", user, book });
    } catch (error) {
        console.log(error);
         res.status(500).json({ message: "Failed to issue book", error: error.message });
    }
}

const returnBook= async(req,res)=>{
    try {
         const { userId, bookId } = req.params;
         const user = await User.findById(userId);
         if (!user) return res.status(404).json({ message: "User not found" });
         const borrowedBook=user.borrowBook.find((b)=>b.bookId.toString()===bookId && !b.returnDate)
         if (!borrowedBook) {
          return res.status(400).json({ message: "This book is not borrowed or already returned" });
         }
         borrowedBook.returnDate=new Date()
         user.borrowBook = user.borrowBook.filter(
          (b) => b.bookId.toString() !== bookId );
            await user.save()
          const book = await Book.findById(bookId);
          book.availableCopies += 1;
          await book.save();
          res.json({ message: "Book returned successfully", user,book });
    } catch (error) {
        res.status(500).json({ message: "Failed to return book", error: error.message });
    }
}

module.exports={addBook, getAllBook,getBookById,updateBook,deleteBook, issueBook, returnBook}