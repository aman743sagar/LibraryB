const express=require('express');
const { register } = require('../controller/userController');
const { getallUser, getUserById, deleteUser } = require('../controller/adminController');
const { isAuthenticate } = require('../Middleware/authmiddleware');
const roleMiddleware = require('../Middleware/rolemiddleware');


const router =express.Router()




// router.post('/addUser',isAuthenticate, roleMiddleware, register)
router.get('/allUsers', isAuthenticate,roleMiddleware,  getallUser)
router.get('/getUserById/:id',isAuthenticate,roleMiddleware,getUserById)
router.delete('/deleteUser/:id',isAuthenticate,roleMiddleware,deleteUser)



module.exports = router;