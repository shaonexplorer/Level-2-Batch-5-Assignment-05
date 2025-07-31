import { model, Schema } from "mongoose";
import { ISender } from "./sender.interface";
import { IRole, IUserStatus } from "../user/user.interface";

export const addressSchema = new Schema(
  {
    street: { type: String, required: true },
    city: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, required: true },
  },
  { _id: false }
);

const senderSchema = new Schema<ISender>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    firstName: { type: String, required: true },
    lastName: { type: String, required: false },
    phoneNumber: { type: String, required: true },
    role: {
      type: String,
      enum: Object.values(IRole),
      required: true,
      default: IRole.sender,
    },
    address: addressSchema,
    status: {
      type: String,
      enum: Object.values(IUserStatus),
      required: false,
      default: IUserStatus.active,
    },
  },
  { timestamps: true }
);

export const Sender = model<ISender>("Sender", senderSchema);
