import { Schema, model, models, Document, Types } from "mongoose"

export interface ISubscription {
  user: Types.ObjectId
  plan: Types.ObjectId
  mealTypes: ("Breakfast" | "Lunch" | "Dinner")[]
  deliveryDays: (
    | "Monday"
    | "Tuesday"
    | "Wednesday"
    | "Thursday"
    | "Friday"
    | "Saturday"
    | "Sunday"
  )[]
  address: string
  allergies?: string
  active: boolean
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
      enum: ["Breakfast", "Lunch", "Dinner"],
      required: true,
      validate: [
        (v: string[]) => v.length > 0,
        "At least one meal type is required.",
      ],
    },
    deliveryDays: {
      type: [String],
      enum: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
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
)

export default models.Subscription ||
  model<ISubscriptionDoc>("Subscription", SubscriptionSchema)
