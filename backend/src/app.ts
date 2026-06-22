import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { swaggerDocs } from "./config/swagger.js";
import authRouter from "./modules/auth/auth.routes.js";
import ticketRouter from "./modules/tickets/ticket.routes.js";
import userRouter from "./modules/users/user.routes.js";
import { errorHandler } from "./middlewares/error.middleware.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

swaggerDocs(app);

// Health check
app.get("/health", (_req, res) => {
    res.status(200).json({
        status: "ok",
        timestamp: new Date().toISOString(),
    });
});

// API Routes
app.use("/api/auth", authRouter);
app.use("/api/tickets", ticketRouter);
app.use("/api/users", userRouter);

// Global error handler — must be registered last
app.use(errorHandler as any);

export default app;