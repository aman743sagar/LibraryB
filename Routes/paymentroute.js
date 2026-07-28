const express = require("express");
const router = express.Router();
const {
  createOrder,
  verifyPayment,
  cashPayment,
  adminOnlinePayment,
  adminverifyPayment
} = require("../controller/paymentController");
const { isAuthenticate} = require("../Middleware/authmiddleware");
const {roleMiddleware}= require("../Middleware/rolemiddleware")

router.post("/create-order", isAuthenticate, createOrder);
router.post("/verify", isAuthenticate, verifyPayment);

router.post("/cash", isAuthenticate, roleMiddleware, cashPayment);
router.post("/admin-online/:id", isAuthenticate,roleMiddleware, adminOnlinePayment);
router.post('/adminVerify',isAuthenticate,adminverifyPayment)



module.exports = router;
