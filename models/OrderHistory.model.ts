import { Schema, model, models, Document, Types } from "mongoose"

export interface IOrderHistory {
  user: Types.ObjectId
  subscription: Types.ObjectId
  plan: Types.ObjectId
  date: Date
  mealType: "Breakfast" | "Lunch" | "Dinner"
  delivered: boolean
  notes?: string
}

export interface IOrderHistoryDoc extends IOrderHistory, Document {}

const OrderHistorySchema = new Schema<IOrderHistoryDoc>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    subscription: {
      type: Schema.Types.ObjectId,
      ref: "Subscription",
      required: true,
    },
    plan: {
      type: Schema.Types.ObjectId,
      ref: "Plan",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    mealType: {
      type: String,
      enum: ["Breakfast", "Lunch", "Dinner"],
      required: true,
    },
    delivered: {
      type: Boolean,
      default: false,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
)

export default models.OrderHistory ||
  model<IOrderHistoryDoc>("OrderHistory", OrderHistorySchema)
