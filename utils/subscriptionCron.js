const cron = require("node-cron");
const Subscription = require("../Models/Subscripation");
const sendNotification=require("./sendNotification")

console.log("✅ Subscription CRON Loaded");

cron.schedule("* * * * *", async () => {
  console.log("🔄 Checking expired & activating next plans...");

  try {
    const now = new Date();

    // 1️⃣ EXPIRE ACTIVE PLANS
    const expiredSubs = await Subscription.find({
      endDate: { $lt: now },
      status: "ACTIVE"
    });

    for (let sub of expiredSubs) {

      // Mark expired
      sub.status = "EXPIRED";
      await sub.save();

       await sendNotification(plan.userId, "Your plan has expired today!");

      // 2️⃣ Find NEXT queued plan
      const nextPlan = await Subscription.findOne({
        userId: sub.userId,
        status: "INACTIVE"
      }).sort({ createdAt: 1 });

      if (nextPlan) {

        let startDate = new Date(sub.endDate);
        let endDate = new Date(startDate);

        if (nextPlan.plan === "MONTHLY") {
          endDate.setMonth(endDate.getMonth() + 1);
        } else if (nextPlan.plan === "YEARLY") {
          endDate.setFullYear(endDate.getFullYear() + 1);
        }

        nextPlan.startDate = startDate;
        nextPlan.endDate = endDate;
        nextPlan.status = "ACTIVE";

        await nextPlan.save();

        console.log(`✅ Auto activated plan for user: ${sub.userId}`);
      }
    }

  } catch (error) {
    console.error("❌ CRON ERROR:", error);
  }
});

module.exports = cron;



