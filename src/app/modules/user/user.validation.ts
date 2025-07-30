import z from "zod";
import { IRole } from "./user.interface";

export const UserCreateSchema = z.object({
  firstName: z.string(),
  lastName: z.string().optional(),
  email: z.email(),
  password: z.string(),
  phoneNumber: z.string().regex(/^(?:\+8801\d{9}|01\d{9})$/, {
    message:
      "Phone number must be valid for Bangladesh. Format: +8801XXXXXXXXX or 01XXXXXXXXX",
  }),
  role: z.enum(Object.values(IRole)).optional(), // "user" , "admin"
  address: z.object({
    street: z.string(),
    city: z.string(),
    zipCode: z.string(),
    country: z.string(),
  }),
});

export const UserUpdateSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.email().optional(),
  password: z.string().optional(),
  phoneNumber: z
    .string()
    .regex(/^(?:\+8801\d{9}|01\d{9})$/, {
      message:
        "Phone number must be valid for Bangladesh. Format: +8801XXXXXXXXX or 01XXXXXXXXX",
    })
    .optional(),
  role: z.enum(Object.values(IRole)).optional(), // "user" , "admin"
  address: z
    .object({
      street: z.string(),
      city: z.string(),
      zipCode: z.string(),
      country: z.string(),
    })
    .optional(),
});
