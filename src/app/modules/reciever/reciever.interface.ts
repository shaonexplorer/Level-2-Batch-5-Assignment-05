import { Types } from "mongoose";
import { IRole, IUserStatus } from "../user/user.interface";

export interface IReciever {
  _id?: Types.ObjectId; // MongoDB's default primary key
  firstName: string;
  lastName?: string;
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
