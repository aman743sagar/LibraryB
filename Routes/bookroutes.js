const express=require('express');
const { addBook, getAllBook, getBookById, updateBook, deleteBook, issueBook, returnBook } = require('../controller/bookController');
const { isAuthenticate } = require('../Middleware/authmiddleware');
const {roleMiddleware} = require('../Middleware/rolemiddleware');


const router =express.Router()



router.post('/addBook',isAuthenticate,roleMiddleware, addBook)
router.get('/getAllBook',isAuthenticate, getAllBook)
router.get('/getBookById/:id',isAuthenticate, getBookById)
router.put('/updateBook/:id',isAuthenticate,roleMiddleware,updateBook)
router.delete('/deleteBook/:id',isAuthenticate,roleMiddleware,deleteBook)
router.post('/issueBook/:userId/:bookId',isAuthenticate,roleMiddleware,issueBook)
router.post('/returnBook/:userId/:bookId',isAuthenticate,roleMiddleware,returnBook)



module.exports = router;