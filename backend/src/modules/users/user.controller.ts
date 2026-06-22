import type { Response, NextFunction } from "express";
import * as userService from "./user.service.js";

export const createAgent = async (
    req: any,
    res: Response,
    next: NextFunction
) => {
    try {
        const agent = await userService.createAgent(req.body);

        res.status(201).json({ success: true, data: agent });
    } catch (err) {
        next(err);
    }
};

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

export const listAgents = async (
    req: any,
    res: Response,
    next: NextFunction
) => {
    try {
        const result = await userService.listAgents(req.query as any);

        res.status(200).json({ success: true, data: result });
    } catch (err) {
        next(err);
    }
};

export const getUserById = async (
    req: any,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = await userService.getUserById(
            req.params.id as string
        );

        res.status(200).json({ success: true, data: user });
    } catch (err) {
        next(err);
    }
};
