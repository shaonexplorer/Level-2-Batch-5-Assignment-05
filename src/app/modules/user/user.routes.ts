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
  authenticate(IRole.admin, IRole.user),
  userController.getUserById
);

router.patch(
  "/:id",
  authenticate(IRole.admin, IRole.user),
  validateByZod(UserUpdateSchema),
  userController.updateUserById
);

router.delete(
  "/:id",
  authenticate(IRole.admin, IRole.user),
  userController.deleteUserById
);

router.post(
  "/register",
  validateByZod(UserCreateSchema),
  authenticate(...Object.values(IRole)),
  userController.register
);

export const userRouter = router;
