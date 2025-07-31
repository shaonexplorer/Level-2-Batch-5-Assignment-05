import { model, Schema } from "mongoose";
import { IParcel, IParcelStatus, IPaymentStatus } from "./parcel.interface";

const trackingHistorySchema = new Schema(
  { status: { type: String, enum: IParcelStatus } },
  { timestamps: true, _id: false }
);

const parcelSchema = new Schema<IParcel>(
  {
    trackingNumber: String, // Unique tracking number eg- TRK123456789
    status: { type: String, enum: IParcelStatus }, // "pending_pickup", "in_transit", "out_for_delivery", "delivered", "failed_delivery", "cancelled"
    sender: { type: Schema.Types.ObjectId, ref: "Sender" }, // Reference to sender model
    receiver: { type: Schema.Types.ObjectId, ref: "Reciever" }, // Reference to reciever model
    packageDetails: {
      weightKg: { type: Number, required: true },
      description: { type: String },
      fragile: Boolean,
    },
    trackingHistory: [trackingHistorySchema],
    paymentDetails: {
      amount: Number,
      currency: { type: String, default: "BDT" },
      status: { type: String, enum: IPaymentStatus }, // "paid", "pending", "failed"
      transactionId: String,
    },
    expectedDeliveryDate: Date,
    actualDeliveryDate: Date,
  },
  { timestamps: true }
);

parcelSchema.pre("save", async function (next) {
  const trackingNumber = `TRK${Date.now()}${Math.ceil(Math.random() * 1000)}`;
  this.trackingNumber = trackingNumber;
  next();
});

export const Parcel = model<IParcel>("Parcel", parcelSchema);
