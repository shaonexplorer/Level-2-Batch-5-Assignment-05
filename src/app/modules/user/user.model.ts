import { model, Schema } from "mongoose";
import { IRole, IUser, IUserStatus } from "./user.interface";
import { string } from "zod";
import bcrypt from "bcrypt";

const addressSchema = new Schema(
  {
    street: { type: string, required: true },
    city: { type: string, required: true },
    zipCode: { type: string, required: true },
    country: { type: string, required: true },
  },
  { _id: false }
);

const userSchema = new Schema<IUser>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: false },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true },
    role: {
      type: String,
      enum: Object.values(IRole),
      required: false,
      default: IRole.user,
    },
    password: { type: String, required: true },
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

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const hashedPassword = await bcrypt.hash(this.password as string, 10);
    this.password = hashedPassword;
    next();
  }
});

export const User = model<IUser>("User", userSchema);
