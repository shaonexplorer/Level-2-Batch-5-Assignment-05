import { Types } from "mongoose";

export enum IRole {
  sender = "sender",
  reciever = "reciever",
  admin = "admin",
}

export enum IUserStatus {
  active = "active",
  inactive = "inactive",
  blocked = "blocked",
}

export interface IUser {
  _id?: Types.ObjectId; // MongoDB's default primary key
  email: string;
  password?: string;
}
