import { Schema, model, models, Types, Document } from "mongoose"

export interface IUser extends Document {
  name: string
  phoneNumber: string
  email?: string
  password?: string
  provider?: "credentials" | "google"
  subscriptions?: Types.ObjectId[]
  testimonials?: Types.ObjectId[]
  orders?: Types.ObjectId[]
  createdAt?: Date
  updatedAt?: Date
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  phoneNumber: { type: String, required: true, unique: true },
  email: { type: String, unique: true, sparse: true },
  password: { type: String }, // hashed
  provider: {
    type: String,
    enum: ["credentials", "google"],
    default: "credentials",
  },
  subscriptions: [{
    type: Schema.Types.ObjectId,
    ref: "Subscription",
  }],
  testimonials: [{
    type: Schema.Types.ObjectId,
    ref: "Testimonial",
  }],
  orders: [{
    type: Schema.Types.ObjectId,
    ref: "OrderHistory",
  }],
}, { timestamps: true })

export default models.User || model<IUser>("User", UserSchema)
