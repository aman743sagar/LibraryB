const express = require("express");
const router = express.Router();
const {
  createSubscription,
  getUserSubscription,
  createCashSubscription,
  expireSubscription,
  checkSubscription
} = require("../controller/SubscripationController");
const { isAuthenticate } = require("../Middleware/authmiddleware");
const {roleMiddleware}= require("../Middleware/rolemiddleware")

router.post("/create", isAuthenticate, createSubscription);
router.post("/cash", isAuthenticate, roleMiddleware, createCashSubscription);

router.get("/:userId", isAuthenticate, getUserSubscription);
router.put("/expire/:id", isAuthenticate, roleMiddleware, expireSubscription);

router.get("/check/me", isAuthenticate, checkSubscription);

module.exports = router;
