import { model, Schema } from "mongoose";
import { IAdmin } from "./admin.interface";
import { IRole } from "../user/user.interface";

const adminSchema = new Schema<IAdmin>({
  name: String,
  role: { type: String, default: IRole.admin },
  userId: { type: Schema.Types.ObjectId, ref: "User" },
});

export const Admin = model<IAdmin>("Admin", adminSchema);
