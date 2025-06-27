import { Schema, model, models, Document, Types } from "mongoose"

export interface ITestimonial {
  user: Types.ObjectId
  subscription?: Types.ObjectId
  order?: Types.ObjectId
  message: string
  rating: number
  featured?: boolean
}

export interface ITestimonialDoc extends ITestimonial, Document {}

const TestimonialSchema = new Schema<ITestimonialDoc>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    subscription: {
      type: Schema.Types.ObjectId,
      ref: "Subscription",
    },
    order: {
      type: Schema.Types.ObjectId,
      ref: "OrderHistory",
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
)

export default models.Testimonial ||
  model<ITestimonialDoc>("Testimonial", TestimonialSchema)
