const Razorpay = require("razorpay");
const crypto = require("crypto");
const Payment = require("../Models/Payment");
const Subscription = require("../Models/Subscripation");
const User = require("../Models/user");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});




const getSubscriptionDates = async (userId, plan) => {
  const active = await Subscription.findOne({ userId, status: "ACTIVE" }).sort({ endDate: -1 });

  let startDate = new Date();
  let status = "ACTIVE";

  if (active) {
    startDate = active.endDate; // queue after old ends
    status = "INACTIVE";
  }

  let endDate = new Date(startDate);

  if (plan === "MONTHLY") endDate.setMonth(endDate.getMonth() + 1);
  if (plan === "YEARLY") endDate.setFullYear(endDate.getFullYear() + 1);

  return { startDate, endDate, status };
};



const createOrder = async (req, res) => {
  try {
    const { plan } = req.body;
    const userId = req.userId;
      console.log("opayment",userId);
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });
    if (!["MONTHLY", "YEARLY"].includes(plan)) return res.status(400).json({ success: false, message: "Invalid plan" });

    const amount = plan === "MONTHLY" ? 500 : 5000;

    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`
    });

    const payment = await Payment.create({
      userId,
      amount,
      method: "RAZORPAY",
      razorpay_order_id: order.id,
      status: "CREATED"
    });

    res.json({
      success: true,
      order,
      paymentId: payment._id,
      key: process.env.RAZORPAY_KEY_ID
    });

  } catch (error) {
    console.error("CREATE ORDER ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ VERIFY PAYMENT
const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, plan } = req.body;
    const userId = req.userId;
    // console.log("vpayment",userId);

    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET).update(sign).digest("hex");

    if (expectedSign !== razorpay_signature) return res.status(400).json({ success: false, message: "Invalid signature" });

    const payment = await Payment.findOne({ razorpay_order_id });
    if (!payment) return res.status(404).json({ success: false, message: "Payment not found" });
    if (payment.status === "SUCCESS") return res.json({ success: true, message: "Already verified" });

    payment.status = "SUCCESS";
    payment.razorpay_payment_id = razorpay_payment_id;
    payment.razorpay_signature = razorpay_signature;
    payment.paidAt = new Date();
    await payment.save();

    // let endDate = new Date();
    // plan === "MONTHLY" ? endDate.setMonth(endDate.getMonth() + 1) : endDate.setFullYear(endDate.getFullYear() + 1);
       const { startDate, endDate, status } = await getSubscriptionDates(userId, plan);

    const subscription = await Subscription.create({
      userId,
      plan,
      amount: payment.amount,
      paymentMode: "RAZORPAY",
      paymentStatus: "PAID",
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      startDate: new Date(),
      endDate,
      status
    });

    // await User.findByIdAndUpdate(userId, { subscription: subscription._id });

     if (status === "ACTIVE") {
      await User.findByIdAndUpdate(userId, { subscription: subscription._id });
    }

    payment.subscriptionId = subscription._id;
    await payment.save();

    res.json({ success: true, message: "Payment successful", subscription });

  } catch (error) {
    console.error("VERIFY ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};


const cashPayment = async (req, res) => {
  try {
    const { userId, plan, remarks } = req.body;
    const adminId = req.userId;


     if (!["MONTHLY", "YEARLY"].includes(plan)) {
      return res.status(400).json({ success: false, message: "Invalid plan" });
    }
     const amount = plan === "MONTHLY" ? 500 : 5000;

    // let endDate = new Date();
    // plan === "MONTHLY" ? endDate.setMonth(endDate.getMonth() + 1) : endDate.setFullYear(endDate.getFullYear() + 1);
        const { startDate, endDate, status } = await getSubscriptionDates(userId, plan);

    const subscription = await Subscription.create({
      userId,
      plan,
      amount,
      paymentMode: "CASH",
      paymentStatus: "PAID",
      startDate,
      endDate,
      status,
      collectedBy: adminId,
      remarks
    });

    await Payment.create({
      userId,
      subscriptionId: subscription._id,
      amount,
      method: "CASH",
      status: "SUCCESS",
      paidAt: new Date()
    });

    // await User.findByIdAndUpdate(userId, { subscription: subscription._id });
     if (status === "ACTIVE") {
      await User.findByIdAndUpdate(userId, { subscription: subscription._id });
    }

    res.json({ success: true, message: "Cash payment successful" });

  } catch (error) {
    console.error("CASH ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const adminOnlinePayment = async (req, res) => {
  try {
    const userId = req.params.id;
    const { plan } = req.body;

    console.log("TARGET USER ID:", userId);

    req.userId = userId;
    req.body.plan = plan;

    return createOrder(req, res,userId);

  } catch (error) {
    console.error("ADMIN ONLINE ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
const adminverifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, plan,userId } = req.body;
    // console.log("vpayment",userId);

    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET).update(sign).digest("hex");

    if (expectedSign !== razorpay_signature) return res.status(400).json({ success: false, message: "Invalid signature" });

    const payment = await Payment.findOne({ razorpay_order_id });
    if (!payment) return res.status(404).json({ success: false, message: "Payment not found" });
    if (payment.status === "SUCCESS") return res.json({ success: true, message: "Already verified" });

    payment.status = "SUCCESS";
    payment.razorpay_payment_id = razorpay_payment_id;
    payment.razorpay_signature = razorpay_signature;
    payment.paidAt = new Date();
    await payment.save();

    // let endDate = new Date();
    // plan === "MONTHLY" ? endDate.setMonth(endDate.getMonth() + 1) : endDate.setFullYear(endDate.getFullYear() + 1);
     const { startDate, endDate, status } = await getSubscriptionDates(userId, plan);

    const subscription = await Subscription.create({
      userId,
      plan,
      amount: payment.amount,
      paymentMode: "RAZORPAY",
      paymentStatus: "PAID",
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      startDate,
      endDate,
      status
    });

    // await User.findByIdAndUpdate(userId, { subscription: subscription._id });

     if (status === "ACTIVE") {
      await User.findByIdAndUpdate(userId, { subscription: subscription._id });
    }

    payment.subscriptionId = subscription._id;
    await payment.save();

    res.json({ success: true, message: "Payment successful", subscription });

  } catch (error) {
    console.error("VERIFY ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};



module.exports = {
  createOrder,
  verifyPayment,
  cashPayment,
  adminOnlinePayment,
  adminverifyPayment
};
