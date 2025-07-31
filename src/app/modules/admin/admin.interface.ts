import { Types } from "mongoose";
import { IRole } from "../user/user.interface";

export interface IAdmin {
  name: string;
  role: IRole.admin;
  userId: Types.ObjectId;
}
