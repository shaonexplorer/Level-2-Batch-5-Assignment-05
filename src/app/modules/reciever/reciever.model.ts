import { model, Schema } from "mongoose";
import { addressSchema } from "../sender/sender.model";
import { IReciever } from "./reciever.interface";
import { IRole, IUserStatus } from "../user/user.interface";

const recieverSchema = new Schema<IReciever>(
  {
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

export const Reciever = model<IReciever>("Reciever", recieverSchema);
