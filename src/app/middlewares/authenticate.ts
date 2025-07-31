import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import "dotenv/config";
import { IRole } from "../modules/user/user.interface";
import { AppError } from "../utils/appError";

export const authenticate =
  (...role: IRole[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization as string;
    const secret = process.env.JWT_SECRET as string;
    const user = jwt.verify(token, secret) as JwtPayload;

    try {
      if (!role.includes(user.role)) {
        throw new AppError(401, "You are not authorized");
      }
      next();
    } catch (error) {
      next(error);
    }
  };
