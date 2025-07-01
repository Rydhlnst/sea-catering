import { Types } from "mongoose";
import { auth } from "@/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Calendar, CheckCircle } from "lucide-react";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/mongoose";
import Subscription, { ISubscriptionDoc } from "@/models/Subscription.model";
import Testimonial from "@/models/Testimonial.model";
import { TestimonialTrigger } from "@/components/dashboard/TestimonialTrigger";
import User from "@/models/User.model";

interface PopulatedSubscription extends Omit<ISubscriptionDoc, "plan"> {
  _id: Types.ObjectId;
  createdAt: Date;
  plan: Types.ObjectId | { name: string };
}

export default async function TestimonialPage() {
    const session = await auth();

    if (!session?.user?.email) {
        redirect("/login");
    }

    await dbConnect();

    // Ambil user dari email, bukan dari session.user.id
    const user = await User.findOne({ email: session.user.email });

    if (!user || !user._id) {
        throw new Error("User not found or ID invalid");
    }

    const subscriptions = await Subscription.find({
        user: user._id,
    })
        .populate("plan", "name")
        .sort({ createdAt: -1 })
        .lean<PopulatedSubscription[]>();

    const userTestimonials = await Testimonial.find({
        user: user._id,
    })
        .select("subscription")
        .lean();

    const reviewedSubscriptionIds = new Set(
        userTestimonials.map((t) => t.subscription?.toString())
    );


  return (
    <div className="container max-w-7xl px-4 mx-auto py-8 space-y-8">
        {subscriptions.length === 0 ? (
            <p>Anda belum memiliki riwayat langganan.</p>
        ) : (
            <div className="flex flex-wrap gap-6">
            {subscriptions.map((sub) => {
                const hasBeenReviewed = reviewedSubscriptionIds.has(sub._id.toString());
                const planName =
                typeof sub.plan === "object" && "name" in sub.plan
                    ? sub.plan.name
                    : "Nama Paket Tidak Tersedia";

                return (
                <Card
                    key={sub._id.toString()}
                    className="flex flex-col justify-between shadow-sm p-4 rounded-md bg-white border basis-full sm:basis-[48%] lg:basis-[31%]"
                >
                    <CardHeader className="p-0 space-y-3">
                    <div className="flex items-center gap-2 text-primary">
                        <Package className="h-5 w-5" />
                        <CardTitle className="text-lg font-semibold">{planName}</CardTitle>
                    </div>
                    <CardDescription className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>
                        Tanggal Langganan:{" "}
                        {new Date(sub.createdAt).toLocaleDateString("id-ID")}
                        </span>
                    </CardDescription>
                    </CardHeader>

                    <CardContent className="pt-4">
                    {hasBeenReviewed ? (
                        <div className="flex items-center gap-2 text-sm font-medium text-green-600">
                        <CheckCircle className="h-5 w-5" />
                        <span>Anda sudah memberi ulasan</span>
                        </div>
                    ) : (
                        <TestimonialTrigger subscriptionId={sub._id.toString()} />
                    )}
                    </CardContent>
                </Card>
                );
            })}
            </div>
        )}
        </div>

  );
}