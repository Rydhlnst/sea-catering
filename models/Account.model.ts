import { Schema, model, models, Types, Document } from "mongoose"

export interface IAccount {
  userId: Types.ObjectId
  name: string
  image?: string
  password?: string // hanya untuk credentials
  provider: "google" | "github" | "credentials"
  providerAccountId: string
}

export interface IAccountDoc extends IAccount, Document {}

const AccountSchema = new Schema<IAccountDoc>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    image: { type: String },
    password: { type: String },
    provider: { type: String, enum: ["credentials", "google", "github"], required: true },
    providerAccountId: { type: String, required: true },
  },
  { timestamps: true },
)

export default models?.Account || model<IAccountDoc>("Account", AccountSchema)
