import express from "express";
import { parcelController } from "./parcel.controller";
import { authenticate } from "../../middlewares/authenticate";
import { IRole } from "../user/user.interface";
import { validateByZod } from "../../middlewares/validate.zod";
import { parcelCreateSchema, parcelUpdateSchema } from "./parcel.validation";

const router = express.Router();

router.post(
  "/",
  authenticate(...Object.values(IRole)),
  validateByZod(parcelCreateSchema),
  parcelController.createParcel
);

router.get("/", authenticate(IRole.admin), parcelController.getParcels);

router.get("/me", authenticate(IRole.user), parcelController.getMe);

router.patch(
  "/:id",
  authenticate(IRole.admin),
  validateByZod(parcelUpdateSchema),
  parcelController.updateParcel
);

export const parcelRouter = router;
