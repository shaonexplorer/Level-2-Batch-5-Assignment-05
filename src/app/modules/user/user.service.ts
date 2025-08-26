import { Request } from "express";
import { User } from "./user.model";
import jwt, { JwtPayload } from "jsonwebtoken";
import "dotenv/config";
import { IRole, IUserStatus } from "./user.interface";
import { AppError } from "../../utils/appError";
import { Sender } from "../sender/sender.model";
import mongoose from "mongoose";
import { Admin } from "../admin/admin.model";

const register = async (req: Request) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const user = await User.create(
      [{ email: req.body.email, password: req.body.password }],
      { session }
    );

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
  const users = await Sender.find().populate("userId", "-password");

  return users;
};

const getMe = async (req: Request) => {
  const token = req.cookies.token as string;
  const secret = process.env.JWT_SECRET as string;
  const { id, role } = jwt.verify(token, secret) as JwtPayload;
  let user;
  if (role == "admin") {
    user = await Admin.findOne({ userId: id }).populate("userId", "-password");
  } else {
    user = await Sender.findOne({ userId: id }).populate("userId", "-password");
  }

  return user;
};

const getUserById = async (req: Request) => {
  const token = req.headers.authorization || (req.cookies.token as string);
  const secret = process.env.JWT_SECRET as string;
  const { id, role } = jwt.verify(token, secret) as JwtPayload;

  const userId = req.params.id;

  const sender = await Sender.findOne({ userId }).select("-password");

  if (!sender) {
    throw new AppError(404, "No user found");
  }

  if (role == IRole.sender && id !== userId) {
    throw new AppError(401, "you are not authorized");
  }

  return sender;
};

const updateUserById = async (req: Request) => {
  const token = req.headers.authorization || (req.cookies.token as string);
  const secret = process.env.JWT_SECRET as string;
  const { id, role } = jwt.verify(token, secret) as JwtPayload;

  const userId = req.params.id;

  // check user cannot update other users
  if (role == IRole.sender && id !== userId) {
    throw new AppError(401, "you are not authorized");
  }
  // check user cannot update role as admin
  if (role == IRole.sender && req.body.role) {
    throw new AppError(401, "you are not authorized");
  }

  const senderToUpdate = await Sender.findOneAndUpdate({ userId }, req.body, {
    new: true,
    runValidators: true,
  }).select("-password");

  if (!senderToUpdate) {
    throw new AppError(404, "No user found");
  }

  return senderToUpdate;
};

const deleteUserById = async (req: Request) => {
  const token = req.headers.authorization || (req.cookies.token as string);
  const secret = process.env.JWT_SECRET as string;
  const { role } = jwt.verify(token, secret) as JwtPayload;

  const userId = req.params.id;
  // check only admin can delete users
  if (role == IRole.sender) {
    throw new AppError(401, "you are not authorized");
  }

  const user = await Sender.findOneAndUpdate(
    { userId },
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
  const userId = req.params.id;

  const user = await Sender.findOneAndUpdate(
    { userId },
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
  getMe,
};
