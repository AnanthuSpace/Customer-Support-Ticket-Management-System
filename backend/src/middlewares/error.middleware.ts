import type { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError.js";

export const errorHandler = (
    err: unknown,
    _req: Request,
    res: Response,
    _next: NextFunction
): void => {
    if (err instanceof ApiError) {
        res.status(err.statusCode).json({
            success: false,
            message: err.message,
        });
        return;
    }

    if (err instanceof Error) {
        res.status(500).json({
            success: false,
            message: err.message || "Internal Server Error",
        });
        return;
    }

    res.status(500).json({
        success: false,
        message: "Internal Server Error",
    });
};
