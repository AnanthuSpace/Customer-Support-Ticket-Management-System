import type { Response, NextFunction } from "express";
import * as userService from "./user.service.js";

export const listUsers = async (
    req: any,
    res: Response,
    next: NextFunction
) => {
    try {
        const result = await userService.listUsers(req.query as any);

        res.status(200).json({ success: true, data: result });
    } catch (err) {
        next(err);
    }
};
