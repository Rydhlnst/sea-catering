import { Schema, model, models, Document } from "mongoose";

export interface IPlan {
  name: "Diet" | "Protein" | "Royal";
  price: number; // price per meal in Rupiah
}

export interface IPlanDoc extends IPlan, Document {}

const PlanSchema = new Schema<IPlanDoc>(
  {
    name: {
      type: String,
      enum: ["Diet", "Protein", "Royal"],
      required: true,
      unique: true,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default models.Plan || model<IPlanDoc>("Plan", PlanSchema);
