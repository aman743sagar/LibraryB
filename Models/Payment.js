const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  subscriptionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subscription"
  },

  amount: {
    type: Number,
    required: true
  },

  method: {
    type: String,
    enum: ["RAZORPAY", "CASH", "ADMIN_ONLINE"],
    required: true
  },

  status: {
    type: String,
    enum: ["CREATED", "SUCCESS", "FAILED"],
    default: "CREATED"
  },

  razorpay_order_id: String,
  razorpay_payment_id: String,
  razorpay_signature: String,

  paidAt: Date

}, { timestamps: true });

const Payment = mongoose.model("Payment", paymentSchema);
module.exports = Payment;
