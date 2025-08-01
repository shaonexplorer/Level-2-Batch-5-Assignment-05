import express from "express";
import { parcelController } from "./parcel.controller";
import { authenticate } from "../../middlewares/authenticate";
import { IRole } from "../user/user.interface";
import { validateByZod } from "../../middlewares/validate.zod";
import {
  parcelCreateSchema,
  parcelStatusUpdateSchema,
  parcelUpdateSchema,
} from "./parcel.validation";

const router = express.Router();

router.post(
  "/",
  validateByZod(parcelCreateSchema),
  authenticate(IRole.admin, IRole.sender),
  parcelController.createParcel
);

router.get("/", authenticate(IRole.admin), parcelController.getParcels);

router.get("/me", authenticate(IRole.sender), parcelController.getMe);

router.get("/:trackingNumber", parcelController.getParcelByTrackingNumber);

router.patch(
  "/status/:id",
  authenticate(IRole.admin),
  validateByZod(parcelStatusUpdateSchema),
  parcelController.updateParcelStatus
);

router.patch(
  "/:id",
  authenticate(IRole.admin),
  validateByZod(parcelUpdateSchema),
  parcelController.updateParcel
);

router.patch(
  "/cancel/:id",
  authenticate(IRole.admin, IRole.sender),
  parcelController.cancelParcel
);

export const parcelRouter = router;
