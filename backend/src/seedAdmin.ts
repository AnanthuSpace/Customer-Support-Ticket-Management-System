import User from "./models/user.model.js";
import bcrypt from "bcrypt";
import { generateUserId } from "./utils/generateIds.js";

export const seedAdmin = async () => {
    const adminExists = await User.findOne({
        email: process.env.ADMIN_EMAIL,
    });

    if (adminExists) {
        console.log("Admin already exists");
        return;
    }

    const hashedPassword = await bcrypt.hash(
        process.env.ADMIN_PASSWORD!,
        10
    );

    await User.create({
        userId: generateUserId(),
        name: "System Admin",
        email: process.env.ADMIN_EMAIL,
        password: hashedPassword,
        role: "admin",
        isActive: true,
    });

    console.log("Admin created successfully");
};