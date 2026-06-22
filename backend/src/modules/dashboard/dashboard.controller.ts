import type { Response, NextFunction } from "express";
import * as dashboardService from "./dashboard.service.js";

export const getSummary = async (req: any, res: Response, next: NextFunction) => {
    try {
        const summary = await dashboardService.getDashboardSummary(req.user);
        res.status(200).json({ success: true, data: summary });
    } catch (err) {
        next(err);
    }
};
