import { Router } from "express";
import * as dashboardController from "./dashboard.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";

const router = Router();

// Dashboard metrics for authenticated users
router.use(protect);
router.get("/", dashboardController.getSummary);

export default router;
