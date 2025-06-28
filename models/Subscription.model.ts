import { Schema, model, models, Document, Types } from "mongoose";

// ENUMS
export const MEAL_TYPES = ["Breakfast", "Lunch", "Dinner"] as const;
export type MealType = (typeof MEAL_TYPES)[number];

export const DELIVERY_DAYS = [
  "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
] as const;
export type DeliveryDay = (typeof DELIVERY_DAYS)[number];

export interface ISubscription {
  user: Types.ObjectId;
  plan: Types.ObjectId;
  mealTypes: MealType[];
  deliveryDays: DeliveryDay[];
  address: string;
  allergies?: string;
  active: boolean;
}

export interface ISubscriptionDoc extends ISubscription, Document {}

const SubscriptionSchema = new Schema<ISubscriptionDoc>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    plan: {
      type: Schema.Types.ObjectId,
      ref: "Plan",
      required: true,
    },
    mealTypes: {
      type: [String],
      enum: MEAL_TYPES,
      required: true,
      validate: [
        (v: string[]) => v.length > 0,
        "At least one meal type is required.",
      ],
    },
    deliveryDays: {
      type: [String],
      enum: DELIVERY_DAYS,
      required: true,
      validate: [
        (v: string[]) => v.length > 0,
        "Select at least one delivery day.",
      ],
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    allergies: {
      type: String,
      trim: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default models.Subscription ||
  model<ISubscriptionDoc>("Subscription", SubscriptionSchema);
