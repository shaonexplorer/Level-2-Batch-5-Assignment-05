import { Request } from "express";
import { User } from "./user.model";
import jwt, { JwtPayload } from "jsonwebtoken";
import "dotenv/config";
import { IRole, IUserStatus } from "./user.interface";
import { AppError } from "../../utils/appError";

const register = async (req: Request) => {
  const user = await User.create(req.body);

  const userWithNoPass = user.toObject();
  delete userWithNoPass.password;

  return userWithNoPass;
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

  if (role == IRole.user && id !== user._id.toString()) {
    throw new AppError(401, "you are not authorized");
  }

  return user;
};

const updateUserById = async (req: Request) => {
  const token = req.headers.authorization as string;
  const secret = process.env.JWT_SECRET as string;
  const { id, role } = jwt.verify(token, secret) as JwtPayload;

  const userId = req.params.id;
  // check user cannot update other users
  if (role == IRole.user && id !== userId) {
    throw new AppError(401, "you are not authorized");
  }
  // check user cannot update role as admin
  if (role == IRole.user && req.body.role) {
    throw new AppError(401, "you are not authorized");
  }
  const user = await User.findOneAndUpdate({ _id: userId }, req.body, {
    new: true,
    runValidators: true,
  }).select("-password");

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
  if (role == IRole.user) {
    throw new AppError(401, "you are not authorized");
  }

  const user = await User.findOneAndUpdate(
    { _id: userId },
    { status: IUserStatus.inactive },
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
};
