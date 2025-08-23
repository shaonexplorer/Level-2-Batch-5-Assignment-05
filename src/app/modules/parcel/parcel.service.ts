import { Request } from "express";
import { Parcel } from "./parcel.model";
import jwt, { JwtPayload } from "jsonwebtoken";
import "dotenv/config";
import { AppError } from "../../utils/appError";
import { Sender } from "../sender/sender.model";
import { Reciever } from "../reciever/reciever.model";
import { IParcelStatus } from "./parcel.interface";
import { QueryBuilder } from "../../utils/queryBuilder";
import { IUserStatus } from "../user/user.interface";

const createParcel = async (req: Request) => {
  const token = req.headers.authorization as string;
  const secret = process.env.JWT_SECRET as string;
  const { id } = jwt.verify(token, secret) as JwtPayload;

  const sender = await Sender.findOne({ userId: id });

  if (sender?.status == (IUserStatus.blocked || IUserStatus.deleted)) {
    throw new AppError(403, "User is not authorized");
  }

  if (!sender) {
    throw new AppError(404, "Sender not found");
  }
  let receiver;

  receiver = await Reciever.findOneAndUpdate(
    {
      phoneNumber: req.body.receiver.phoneNumber,
    },
    { ...req.body.receiver },
    { new: true }
  );

  if (!receiver) {
    receiver = await Reciever.create(req.body.receiver);
  }

  const parcel = await Parcel.create({
    ...req.body,
    sender: sender._id,
    receiver: receiver._id,
    status: IParcelStatus.pending,
    trackingHistory: [{ status: IParcelStatus.pending }],
  });

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

const updateParcelStatus = async (req: Request) => {
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

  const query = new QueryBuilder(Parcel.find(), filter);

  const parcels = await query
    .filter()
    .sort()
    .pagination()
    .selectFields()
    .build();

  // const parcels = Parcel.find(filter);

  return parcels;
};

const getMe = async (req: Request) => {
  const token = req.headers.authorization || (req.cookies.token as string);
  const secret = process.env.JWT_SECRET as string;
  const { id } = jwt.verify(token, secret) as JwtPayload;

  const sender = await Sender.findOne({ userId: id });

  if (sender?.status == (IUserStatus.blocked || IUserStatus.deleted)) {
    throw new AppError(403, "User is not authorized");
  }

  if (!sender) {
    throw new AppError(404, "Sender not found");
  }

  const parcels = await Parcel.find({ sender: sender._id });

  return parcels;
};

const getParcelByTrackingNumber = async (req: Request) => {
  const trackingNo = req.params.trackingNumber;
  const parcel = await Parcel.findOne({ trackingNumber: trackingNo });
  return parcel;
};

const cancelParcel = async (req: Request) => {
  const parcelId = req.params.id;

  const token = req.headers.authorization as string;
  const secret = process.env.JWT_SECRET as string;
  const { id } = jwt.verify(token, secret) as JwtPayload;

  const sender = await Sender.findOne({ userId: id });

  if (sender?.status == (IUserStatus.blocked || IUserStatus.deleted)) {
    throw new AppError(403, "User is not authorized");
  }

  const parcel = await Parcel.findById(parcelId);

  if (parcel?.status !== IParcelStatus.pending) {
    throw new AppError(
      403,
      "Parcel is already dispatched, can not be cancelled now"
    );
  }

  parcel.status = IParcelStatus.cancelled;

  parcel.trackingHistory.push({ status: IParcelStatus.cancelled });

  await parcel.save();

  // const parcel = await Parcel.findByIdAndUpdate(
  //   id,
  //   {
  //     status: IParcelStatus.cancelled,
  //     $push: { trackingHistory: { status: IParcelStatus.cancelled } },
  //   },
  //   { new: true, runValidators: true }
  // );

  return parcel;
};

export const parcelService = {
  createParcel,
  updateParcel,
  getParcels,
  getMe,
  getParcelByTrackingNumber,
  cancelParcel,
  updateParcelStatus,
};
