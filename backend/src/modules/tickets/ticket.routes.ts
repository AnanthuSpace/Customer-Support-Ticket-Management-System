import { Router } from "express";
import * as ticketController from "./ticket.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";
import { authorize } from "../../middlewares/role.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import {
    createTicketSchema,
    updateStatusSchema,
} from "./ticket.validation.js";

const router = Router();

// All ticket routes require authentication
router.use(protect);

/**
 * POST /api/tickets
 * Create a new ticket (any authenticated user)
 */
router.post(
    "/",
    validate(createTicketSchema),
    ticketController.createTicket
);

/**
 * GET /api/tickets
 * Get all tickets — customers see their own, agents/admins see all
 */
router.get("/", ticketController.getTickets);

/**
 * GET /api/tickets/:id
 * Get a single ticket by MongoDB _id
 */
router.get("/:id", ticketController.getTicketById);

/**
 * PUT /api/tickets/:id
 * Update ticket status — agents and admins only
 */
router.put(
    "/:id",
    authorize("agent", "admin"),
    validate(updateStatusSchema),
    ticketController.updateTicketStatus
);

/**
 * DELETE /api/tickets/:id
 * Delete a ticket — admin deletes any, customer deletes their own
 */
router.delete("/:id", ticketController.deleteTicket);

export default router;
