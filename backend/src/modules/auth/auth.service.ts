import bcrypt from "bcrypt";
import * as repo from "./auth.repository.js";
import { generateToken, generateRefreshToken } from "../../utils/jwt.js";
import { generateUserId } from "../../utils/generateIds.js";
import { ApiError } from "../../utils/ApiError.js";

export const register = async (payload: {
    name: string;
    email: string;
    password: string;
}) => {
    const exists = await repo.findByEmail(payload.email);
    if (exists) throw new ApiError(409, "User already exists");

    const hashedPassword = await bcrypt.hash(payload.password, 10);

    const user = await repo.createUser({
        userId: generateUserId(),
        name: payload.name,
        email: payload.email,
        password: hashedPassword,
        role: "customer",
    });

    const userObj = user.toObject() as Record<string, unknown>;
    delete userObj["password"];
    return userObj;
};

export const login = async (payload: { email: string; password: string }) => {
    const user = await repo.findByEmail(payload.email);
    if (!user) throw new ApiError(401, "Invalid credentials");

    const isMatch = await bcrypt.compare(payload.password, user.password);
    if (!isMatch) throw new ApiError(401, "Invalid credentials");

    const accessToken = generateToken(user.id, user.role);
    const refreshToken = generateRefreshToken(user.id, user.role);

    const userObj = user.toObject() as Record<string, unknown>;
    delete userObj["password"];

    return { accessToken, refreshToken, user: userObj };
};