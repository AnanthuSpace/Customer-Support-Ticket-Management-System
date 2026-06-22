import { Schema, model } from "mongoose";

export enum UserRole {
    ADMIN = "admin",
    AGENT = "agent",
    CUSTOMER = "customer",
}

const userSchema = new Schema(
    {
        userId: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },

        name: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        password: {
            type: String,
            required: true,
            select: false,
        },

        role: {
            type: String,
            enum: Object.values(UserRole),
            default: UserRole.CUSTOMER,
        },

        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

const User = model("User", userSchema);

export default User;