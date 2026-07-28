const Subscription = require("../Models/Subscripation");
const User = require("../Models/user");


const createSubscription = async (req, res) => {
  try {
    const { userId, plan, amount, paymentMode, remarks } = req.body;

    let endDate = new Date();

    if (plan === "MONTHLY") {
      endDate.setMonth(endDate.getMonth() + 1);
    } else {
      endDate.setFullYear(endDate.getFullYear() + 1);
    }

    const subscription = await Subscription.create({
      userId,
      plan,
      amount,
      paymentMode,
      paymentStatus: "PAID",
      startDate: new Date(),
      endDate,
      status: "ACTIVE",
      collectedBy: req.user ? req.user._id : null,
      remarks
    });

    await User.findByIdAndUpdate(userId, {
      subscription: subscription._id
    });

    res.status(201).json({
      success: true,
      message: "Subscription activated successfully",
      data: subscription
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Subscription creation failed",
      error: err.message
    });
  }
};

const getUserSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findOne({
      userId: req.params.userId
    }).sort({ createdAt: -1 });

    if (!subscription) {
      return res.status(404).json({ message: "No subscription found" });
    }

    res.json(subscription);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const createCashSubscription = async (req, res) => {
  try {
    const { userId, plan, amount, remarks } = req.body;

    let endDate = new Date();

    if (plan === "MONTHLY") {
  endDate.setMonth(endDate.getMonth() + 1);
} else if (plan === "YEARLY") {
  endDate.setFullYear(endDate.getFullYear() + 1);
} else {
  return res.status(400).json({ message: "Invalid Plan Value Received" });
}

    const subscription = await Subscription.create({
      userId,
      plan,
      amount,
      paymentMode: "CASH",
      paymentStatus: "PAID",
      startDate: new Date(),
      endDate,
      status: "ACTIVE",
      collectedBy: req.id,
      remarks
    });

    await User.findByIdAndUpdate(userId, {
      subscription: subscription._id
    });

    res.status(201).json({
      success: true,
      message: "Cash subscription created successfully",
      subscription
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const expireSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findById(req.params.id);

    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    subscription.status = "EXPIRED";
    await subscription.save();

    res.json({ success: true, message: "Subscription expired" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const checkSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findOne({
      userId: req.userId,
      status: "ACTIVE",
      endDate: { $gte: new Date() }
    });

    if (!subscription) {
      return res.json({ active: false });
    }

    res.json({ active: true, subscription });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
module.exports={checkSubscription,expireSubscription,createCashSubscription,getUserSubscription,createSubscription}