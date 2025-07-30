import { Request } from "express";
import { Parcel } from "./parcel.model";
import jwt, { JwtPayload } from "jsonwebtoken";
import "dotenv/config";
import { AppError } from "../../utils/appError";

const createParcel = async (req: Request) => {
  const token = req.headers.authorization as string;
  const secret = process.env.JWT_SECRET as string;
  const { id } = jwt.verify(token, secret) as JwtPayload;
  const parcel = await Parcel.create({ ...req.body, sender: id });

  return parcel;
};

const updateParcel = async (req: Request) => {
  const parcel = Parcel.findByIdAndUpdate(
    req.params.id,
    { ...req.body, $push: { trackingHistory: { status: req.body.status } } },
    { new: true, runValidators: true }
  );

  if (!parcel) {
    throw new AppError(404, "parcel not found");
  }

  return parcel;
};

const getParcels = async (req: Request) => {
  const filter = req.query;

  const parcels = Parcel.find(filter);

  return parcels;
};

const getMe = async (req: Request) => {
  const token = req.headers.authorization as string;
  const secret = process.env.JWT_SECRET as string;
  const { id } = jwt.verify(token, secret) as JwtPayload;

  const parcels = await Parcel.find({ sender: id });

  return parcels;
};

export const parcelService = {
  createParcel,
  updateParcel,
  getParcels,
  getMe,
};
