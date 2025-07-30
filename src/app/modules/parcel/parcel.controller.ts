import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { parcelService } from "./parcel.service";
import { sendResponse } from "../../utils/sendResponse";

const createParcel = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const parcel = await parcelService.createParcel(req);

    sendResponse(res, {
      status: 201,
      success: true,
      message: "parcel created successfully",
      data: parcel,
    });
  }
);

const updateParcel = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const parcel = await parcelService.updateParcel(req);

    sendResponse(res, {
      status: 201,
      success: true,
      message: "parcel updated successfully",
      data: parcel,
    });
  }
);

const getParcels = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const parcels = await parcelService.getParcels(req);

    sendResponse(res, {
      status: 201,
      success: true,
      message: "parcels retrieved successfully",
      data: parcels,
    });
  }
);

const getMe = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const parcels = await parcelService.getMe(req);

    sendResponse(res, {
      status: 201,
      success: true,
      message: "parcels retrieved successfully",
      data: parcels,
    });
  }
);

export const parcelController = {
  createParcel,
  updateParcel,
  getParcels,
  getMe,
};
