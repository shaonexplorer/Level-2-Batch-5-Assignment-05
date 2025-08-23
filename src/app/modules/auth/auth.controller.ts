import { NextFunction, Request, Response } from "express";
import passport from "passport";
import { IRole, IUser } from "../user/user.interface";
import jwt from "jsonwebtoken";
import { sendResponse } from "../../utils/sendResponse";
import "dotenv/config";
import { catchAsync } from "../../utils/catchAsync";
import { Admin } from "../admin/admin.model";

const secret = process.env.JWT_SECRET;

const login = async (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate("local", async (error: any, user: any) => {
    try {
      if (error) {
        throw new Error(error);
      }

      const isAdmin = await Admin.findOne({ userId: user._id });

      const token = jwt.sign(
        {
          id: user._id,
          email: user.email,
          role: isAdmin ? IRole.admin : IRole.sender,
        },
        secret as string,
        {
          expiresIn: "30d",
        }
      );

      const refressToken = jwt.sign(
        {
          id: user._id,
          email: user.email,
          role: isAdmin ? IRole.admin : IRole.sender,
        },
        secret as string,
        {
          expiresIn: "60d",
        }
      );

      res.cookie("token", token, {
        secure: true,
        httpOnly: true,
        sameSite: "none",
      });
      res.cookie("refreshToken", refressToken, {
        secure: true,
        httpOnly: true,
        sameSite: "none",
      });

      const userWithoutPassword = user.toObject();

      delete userWithoutPassword.password;

      sendResponse(res, {
        status: 200,
        success: true,
        message: "Logged in successfully",
        data: userWithoutPassword,
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  })(req, res, next);
};

const logout = catchAsync((req: Request, res: Response, next: NextFunction) => {
  res.clearCookie("token");
  res.clearCookie("refreshToken");

  sendResponse(res, {
    status: 200,
    success: true,
    message: "User successfully logged out",
    data: null,
  });
});

export const authController = {
  login,
  logout,
};
