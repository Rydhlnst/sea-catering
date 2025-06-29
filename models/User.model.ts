import { Schema, models, model, Document, Types } from "mongoose";

export interface IUser {
  name: string;
  username: string;
  phoneNumber: string;
  email?: string;
  image?: string;
  subscriptions?: Types.ObjectId[];
  testimonials?: Types.ObjectId[];
  orders?: Types.ObjectId[];
  role?: "user" | "admin";
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUserDoc extends IUser, Document {}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    image: { type: String },
    username: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true, unique: true },
    email: { type: String, unique: true, sparse: true },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    subscriptions: [{ type: Schema.Types.ObjectId, ref: "Subscription" }],
    testimonials: [{ type: Schema.Types.ObjectId, ref: "Testimonial" }],
    orders: [{ type: Schema.Types.ObjectId, ref: "OrderHistory" }],
  },
  { timestamps: true }
);

const User = models?.User || model<IUser>("User", UserSchema);

export default User;
