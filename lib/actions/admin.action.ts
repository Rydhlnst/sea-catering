"use server";

import dbConnect from "@/lib/mongoose";
import Subscription from "@/models/Subscription.model";

export async function getAdminStats(from: Date, to: Date) {
  await dbConnect();

  const newSubscriptions = await Subscription.countDocuments({
    createdAt: { $gte: from, $lte: to },
  });

  const activeSubs = await Subscription.find({
    status: "active",
    createdAt: { $gte: from, $lte: to },
  }).populate("plan");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mrr = activeSubs.reduce((sum, sub: any) => {
    return sum + (sub.plan?.price || 0);
  }, 0);

  const reactivations = await Subscription.countDocuments({
    reactivatedAt: { $gte: from, $lte: to },
  });

  const totalActive = await Subscription.countDocuments({ status: "active" });

  return {
    newSubscriptions,
    mrr,
    reactivations,
    totalActive,
  };
}
