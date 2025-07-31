import { Types } from "mongoose";

export enum IParcelStatus {
  pending = "pending_pickup",
  picked_up = "picked_up",
  inTransit = "in_transit",
  out_for_delivery = "out_for_delivery",
  delivered = "delivered",
  failed_delivery = "failed_delivery",
  cancelled = "cancelled",
}

export enum IPaymentStatus {
  paid = "paid",
  pending = "pending",
  failed = "failed",
}

export interface IParcel {
  _id: Types.ObjectId;
  trackingNumber: string; // Unique tracking number eg- TRK123456789
  status: IParcelStatus; // "pending_pickup", "in_transit", "out_for_delivery", "delivered", "failed_delivery", "cancelled"
  sender: Types.ObjectId; // Reference to sender model
  receiver: Types.ObjectId; // Reference to reciever model
  packageDetails: {
    weightKg: number;
    description: string;
    fragile: boolean;
  };
  trackingHistory: [
    {
      status: IParcelStatus;
    }
  ];
  paymentDetails: {
    amount: number;
    currency: "BDT";
    status: IPaymentStatus; // "paid", "pending", "failed"
    transactionId: string;
  };
  expectedDeliveryDate: Date;
  actualDeliveryDate: Date;
}
