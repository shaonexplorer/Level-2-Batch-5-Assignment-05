import { NextFunction, Request, Response } from "express";
import passport from "passport";
import { IUser } from "../user/user.interface";
import jwt from "jsonwebtoken";
import { sendResponse } from "../../utils/sendResponse";
import "dotenv/config";
import { catchAsync } from "../../utils/catchAsync";

const secret = process.env.JWT_SECRET;

const login = async (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate("local", async (error: any, user: any) => {
    try {
      if (error) {
        throw new Error(error);
      }

      const token = jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        secret as string,
        {
          expiresIn: "30d",
        }
      );

      const refressToken = jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        secret as string,
        {
          expiresIn: "60d",
        }
      );

      res.cookie("token", token, { secure: false, httpOnly: true });
      res.cookie("refreshToken", refressToken, {
        secure: false,
        httpOnly: true,
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
