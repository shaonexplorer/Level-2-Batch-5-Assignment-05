import { User } from "../modules/user/user.model";
import "dotenv/config";
import bcrypt from "bcrypt";
import { Admin } from "../modules/admin/admin.model";

const adminEmail = process.env.ADMIN_EMAIL;
const adminPassword = process.env.ADMIN_PASSWORD;

export const seedAdmin = async () => {
  try {
    const isAdminExist = await User.findOne({
      email: adminEmail,
    });

    if (isAdminExist) {
      console.log("Admin Already Exists!");
      return;
    }

    console.log("Trying to create Admin...");

    const user = await User.create({
      email: adminEmail,
      password: adminPassword,
    });

    const admin = await Admin.create({ name: "admin", userId: user._id });
    console.log("Admin Created Successfuly! \n");
    console.log(user);
  } catch (error) {
    console.log(error);
  }
};
