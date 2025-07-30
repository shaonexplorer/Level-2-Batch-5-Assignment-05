import { Response } from "express";

export interface IPayloadResponse<T> {
  status: number;
  success: boolean;
  message: string;
  data: T;
}

export const sendResponse = <T>(
  res: Response,
  payload: IPayloadResponse<T>
) => {
  res.status(payload.status).json({
    status: payload.status,
    success: payload.success,
    message: payload.message,
    data: payload.data,
  });
};
