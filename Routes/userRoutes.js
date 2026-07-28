const express=require('express')
const {  login, register, logout, fetchProfile } = require("../controller/userController")
const { isAuthenticate } = require('../Middleware/authmiddleware')
const {roleMiddleware} = require('../Middleware/rolemiddleware')

const router =express.Router()



router.post('/register',isAuthenticate, roleMiddleware, register)
router.post('/login',login)
router.get('/getProfile',isAuthenticate,fetchProfile)
router.post('/logout',logout)



module.exports = router;