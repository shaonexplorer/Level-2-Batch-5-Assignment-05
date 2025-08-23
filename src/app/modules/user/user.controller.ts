import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { userService } from "./user.service";
import { IPayloadResponse, sendResponse } from "../../utils/sendResponse";
import { IUser } from "./user.interface";
import { ISender } from "../sender/sender.interface";

const getUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const users = await userService.getUsers();

    sendResponse(res, {
      status: 200,
      success: true,
      message: "users successfully retrieved",
      data: users,
    });
  }
);

const getUserById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await userService.getUserById(req);

    sendResponse(res, {
      status: 200,
      success: true,
      message: "user successfully retrieved",
      data: user,
    });
  }
);

const updateUserById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await userService.updateUserById(req);

    sendResponse(res, {
      status: 200,
      success: true,
      message: "user successfully updated",
      data: user,
    });
  }
);

const deleteUserById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await userService.deleteUserById(req);

    sendResponse(res, {
      status: 200,
      success: true,
      message: "user successfully deleted",
      data: user,
    });
  }
);

const blockUserById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await userService.blockUserById(req);

    sendResponse(res, {
      status: 200,
      success: true,
      message: "user successfully blocked",
      data: user,
    });
  }
);

const register = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userWithNoPass, sender } = await userService.register(req);

    const payload: IPayloadResponse = {
      status: 201,
      success: true,
      message: "user created successfully",
      data: { userWithNoPass, sender },
    };

    sendResponse(res, payload);
  }
);
const getMe = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await userService.getMe(req);
    sendResponse(res, {
      status: 200,
      success: true,
      message: "user profile retrieved successfully",
      data: user,
    });
  }
);

export const userController = {
  register,
  getUsers,
  getUserById,
  updateUserById,
  deleteUserById,
  blockUserById,
  getMe,
};
