import type { Response, NextFunction } from "express";
import * as ticketService from "./ticket.service.js";

export const createTicket = async (
    req: any,
    res: Response,
    next: NextFunction
) => {
    try {
        const ticket = await ticketService.createTicket(
            req.body,
            req.user.userId
        );

        res.status(201).json({ success: true, data: ticket });
    } catch (err) {
        next(err);
    }
};

export const getTickets = async (
    req: any,
    res: Response,
    next: NextFunction
) => {
    try {
        const {
            search,
            status,
            page,
            limit,
        } = req.query as Record<string, string | undefined>;

        const tickets = await ticketService.getTickets(req.user, {
            search,
            status,
            page: page ? Number(page) : undefined,
            limit: limit ? Math.min(100, Number(limit)) : undefined,
        });

        res.status(200).json({ success: true, data: tickets });
    } catch (err) {
        next(err);
    }
};

export const getTicketById = async (
    req: any,
    res: Response,
    next: NextFunction
) => {
    try {
        const ticket = await ticketService.getTicketById(
            req.params.id as string,
            req.user
        );

        res.status(200).json({ success: true, data: ticket });
    } catch (err) {
        next(err);
    }
};

export const updateTicketStatus = async (
    req: any,
    res: Response,
    next: NextFunction
) => {
    try {
        const ticket = await ticketService.updateTicketStatus(
            req.params.id as string,
            req.body.status as string
        );

        res.status(200).json({ success: true, data: ticket });
    } catch (err) {
        next(err);
    }
};

export const updateTicketNote = async (
    req: any,
    res: Response,
    next: NextFunction
) => {
    try {
        const ticket = await ticketService.updateNote(
            req.params.id as string,
            req.body.note as string
        );

        res.status(200).json({ success: true, data: ticket });
    } catch (err) {
        next(err);
    }
};

export const updateTicketAssignment = async (
    req: any,
    res: Response,
    next: NextFunction
) => {
    try {
        const ticket = await ticketService.updateTicketAssignment(
            req.params.id as string,
            req.body.assignedTo as string
        );

        res.status(200).json({ success: true, data: ticket });
    } catch (err) {
        next(err);
    }
};

export const deleteTicket = async (
    req: any,
    res: Response,
    next: NextFunction
) => {
    try {
        await ticketService.deleteTicket(
            req.params.id as string,
            req.user
        );

        res.status(200).json({
            success: true,
            message: "Ticket deleted successfully",
        });
    } catch (err) {
        next(err);
    }
};
