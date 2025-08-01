import { Request } from "express";
import { User } from "./user.model";
import jwt, { JwtPayload } from "jsonwebtoken";
import "dotenv/config";
import { IRole, IUserStatus } from "./user.interface";
import { AppError } from "../../utils/appError";
import { Sender } from "../sender/sender.model";
import mongoose from "mongoose";

const register = async (req: Request) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const user = await User.create([req.body], { session });

    const sender = await Sender.create(
      [
        {
          ...req.body,
          userId: user[0]._id,
        },
      ],
      { session }
    );

    const userWithNoPass = user[0].toObject();
    delete userWithNoPass.password;

    await session.commitTransaction();
    session.endSession();
    return { userWithNoPass, sender };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw new Error(error as any);
  }
};

const getUsers = async () => {
  const users = await User.find().select("-password");
  return users;
};

const getUserById = async (req: Request) => {
  const token = req.headers.authorization as string;
  const secret = process.env.JWT_SECRET as string;
  const { id, role } = jwt.verify(token, secret) as JwtPayload;

  const userId = req.params.id;
  const user = await User.findById(userId).select("-password");

  if (!user) {
    throw new AppError(404, "No user found");
  }

  if (role == IRole.sender && id !== user._id.toString()) {
    throw new AppError(401, "you are not authorized");
  }

  return user;
};

const updateUserById = async (req: Request) => {
  const token = req.headers.authorization as string;
  const secret = process.env.JWT_SECRET as string;
  const { id, role } = jwt.verify(token, secret) as JwtPayload;

  const sender = await Sender.findOne({ userId: id });

  const senderIdToUpdate = req.params.id;
  // check user cannot update other users
  if (role == IRole.sender && sender?._id.toString() !== senderIdToUpdate) {
    throw new AppError(401, "you are not authorized");
  }
  // check user cannot update role as admin
  if (role == IRole.sender && req.body.role) {
    throw new AppError(401, "you are not authorized");
  }
  const user = await User.findOneAndUpdate(
    { _id: senderIdToUpdate },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  ).select("-password");

  if (!user) {
    throw new AppError(404, "No user found");
  }

  return user;
};

const deleteUserById = async (req: Request) => {
  const token = req.headers.authorization as string;
  const secret = process.env.JWT_SECRET as string;
  const { role } = jwt.verify(token, secret) as JwtPayload;

  const userId = req.params.id;
  // check only admin can delete users
  if (role == IRole.sender) {
    throw new AppError(401, "you are not authorized");
  }

  const user = await User.findOneAndUpdate(
    { _id: userId },
    { status: IUserStatus.deleted },
    {
      new: true,
      runValidators: true,
    }
  ).select("-password");

  if (!user) {
    throw new AppError(404, "No user found");
  }

  return user;
};

const blockUserById = async (req: Request) => {
  const senderIdToBlock = req.params.id;

  const user = await Sender.findOneAndUpdate(
    { _id: senderIdToBlock },
    { status: IUserStatus.blocked },
    {
      new: true,
      runValidators: true,
    }
  ).select("-password");

  if (!user) {
    throw new AppError(404, "No user found");
  }

  return user;
};

export const userService = {
  register,
  getUsers,
  getUserById,
  updateUserById,
  deleteUserById,
  blockUserById,
};
