import jwt from "jsonwebtoken";
import type { Response, NextFunction } from "express";

export const protect = (
    req: any,
    res: Response,
    next: NextFunction
) => {
    try {
        const token =
            req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: no token provided",
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!);
        req.user = decoded;
        next();
    } catch {
        return res.status(401).json({
            success: false,
            message: "Unauthorized: invalid or expired token",
        });
    }
};