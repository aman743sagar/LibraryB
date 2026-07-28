
const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  plan: {
    type: String,
    enum: ["MONTHLY", "YEARLY"],
    required: true
  },

  amount: {
    type: Number,
    required: true
  },

  paymentMode: {
    type: String,
    enum: ["RAZORPAY", "CASH", "ADMIN_ONLINE"],
    required: true
  },

  paymentStatus: {
    type: String,
    enum: ["PENDING", "PAID", "FAILED"],
    default: "PENDING"
  },

  razorpay_order_id: {
    type: String,
    default: null
  },

  razorpay_payment_id: {
    type: String,
    default: null
  },

  razorpay_signature: {
    type: String,
    default: null
  },

  startDate: Date,
  endDate: Date,

  status: {
    type: String,
    enum: ["ACTIVE", "EXPIRED", "INACTIVE"],
    default: "INACTIVE"
  },

  collectedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
  },

  remarks: String

}, { timestamps: true });


const Subscription=mongoose.model("Subscription", subscriptionSchema)
module.exports=Subscription