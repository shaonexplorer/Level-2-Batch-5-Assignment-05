import express from "express";
import { userController } from "./user.controller";
import { validateByZod } from "../../middlewares/validate.zod";
import { UserCreateSchema, UserUpdateSchema } from "./user.validation";
import { authenticate } from "../../middlewares/authenticate";
import { IRole } from "./user.interface";

const router = express.Router();

router.get("/all", authenticate(IRole.admin), userController.getUsers);

router.get(
  "/:id",
  authenticate(IRole.admin, IRole.sender),
  userController.getUserById
);

router.patch(
  "/:id",
  authenticate(IRole.admin, IRole.sender),
  validateByZod(UserUpdateSchema),
  userController.updateUserById
);

router.patch(
  "/block/:id",
  authenticate(IRole.admin),
  userController.blockUserById
);

router.delete("/:id", authenticate(IRole.admin), userController.deleteUserById);

router.post(
  "/register",
  validateByZod(UserCreateSchema),
  userController.register
);

export const userRouter = router;
