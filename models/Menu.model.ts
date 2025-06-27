import { Schema, model, models, Types, Document } from "mongoose"

export interface IMenu extends Document {
  name: string
  description?: string
  imageUrl?: string
  category: "breakfast" | "lunch" | "dinner"
  price: number
  tags?: string[]
  isActive: boolean
  plan: "diet" | "protein" | "royal"
  createdBy?: Types.ObjectId
}

const MenuSchema = new Schema<IMenu>({
  name: { type: String, required: true },
  description: { type: String },
  imageUrl: { type: String },
  category: {
    type: String,
    enum: ["breakfast", "lunch", "dinner"],
    required: true,
  },
  price: { type: Number, required: true },
  tags: [{ type: String }],
  isActive: { type: Boolean, default: true },

  // relasi ke plan
  plan: {
    type: String,
    enum: ["diet", "protein", "royal"],
    required: true,
  },

  // relasi ke user (optional, siapa yang input)
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
}, { timestamps: true })

export default models.Menu || model<IMenu>("Menu", MenuSchema)
