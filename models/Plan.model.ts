import { Schema, model, models, Document } from "mongoose";

// ENUM untuk jenis plan
export const PLAN_TYPES = ["Diet", "Protein", "Royal"] as const;
export type PlanName = (typeof PLAN_TYPES)[number];

export interface IPlan {
  name: PlanName;
  price: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IPlanDoc extends IPlan, Document {}

const PlanSchema = new Schema<IPlanDoc>(
  {
    name: {
      type: String,
      enum: PLAN_TYPES,
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

const Plan = models?.Plan || model<IPlanDoc>("Plan", PlanSchema);

export default Plan;
