import { model, Schema } from "mongoose";
import bcrypt from "bcrypt";
import { IUser } from "./user.interface";

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
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
