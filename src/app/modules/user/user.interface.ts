import { Types } from "mongoose";

export enum IRole {
  user = "user",
  admin = "admin",
}

export enum IUserStatus {
  active = "active",
  inactive = "inactive",
  blocked = "blocked",
}

export interface IUser {
  _id?: Types.ObjectId; // MongoDB's default primary key
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  phoneNumber: string;
  role: IRole; // "sender", "reciever", "admin"
  status: IUserStatus; // "active", "inactive", "blocked"
  address: {
    street: string;
    city: string;
    zipCode: string;
    country: string;
  };
}
