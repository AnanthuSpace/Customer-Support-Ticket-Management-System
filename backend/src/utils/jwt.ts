import jwt from "jsonwebtoken";

// Derive a separate refresh secret so tokens can't be swapped
const REFRESH_SECRET = process.env.JWT_SECRET! + "_refresh_v1";

export const generateToken = (userId: string, role: string) =>
    jwt.sign({ userId, role }, process.env.JWT_SECRET!, { expiresIn: "15m" });

export const generateRefreshToken = (userId: string, role: string) =>
    jwt.sign({ userId, role }, REFRESH_SECRET, { expiresIn: "7d" });

export const verifyRefreshToken = (token: string) =>
    jwt.verify(token, REFRESH_SECRET) as { userId: string; role: string };