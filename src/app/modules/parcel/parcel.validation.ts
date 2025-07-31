import z from "zod";

export const parcelCreateSchema = z.object({
  receiver: z.object({
    firstName: z.string(),
    phoneNumber: z.string(),
    email: z.email(),
    address: z.object({
      street: z.string(),
      city: z.string(),
      zipCode: z.string(),
      country: z.string(),
    }),
  }),
  packageDetails: z.object({
    weightKg: z.number().positive(),
    description: z.string(),
    fragile: z.boolean(),
  }),
});

export const parcelUpdateSchema = z.object({
  status: z.string().optional(), // "pending_pickup", "in_transit", "out_for_delivery", "delivered", "failed_delivery", "cancelled"
  receiver: z
    .object({
      name: z.string(),
      phoneNumber: z.string(),
      email: z.email(),
      address: z
        .object({
          street: z.string(),
          city: z.string(),
          zipCode: z.string(),
          country: z.string(),
        })
        .optional(),
    })
    .optional(),
  packageDetails: z
    .object({
      weightKg: z.number().positive(),
      description: z.string(),
      fragile: z.boolean(),
    })
    .optional(),
  trackingHistory: z
    .array(
      z
        .object({
          status: z.string(),
        })
        .optional()
    )
    .optional(),
  paymentDetails: z
    .object({
      amount: z.number().positive(),
      currency: z.string(),
      status: z.string(), // "paid", "pending", "failed"
      transactionId: z.string(),
    })
    .optional(),
  expectedDeliveryDate: z.date().optional(),
  actualDeliveryDate: z.date().optional(),
});
