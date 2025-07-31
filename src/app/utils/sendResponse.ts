import { Response } from "express";

export interface IPayloadResponse {
  status: number;
  success: boolean;
  message: string;
  data: any;
}

export const sendResponse = (res: Response, payload: IPayloadResponse) => {
  res.status(payload.status).json({
    status: payload.status,
    success: payload.success,
    message: payload.message,
    data: payload.data,
  });
};
