import * as repo from "./ticket.repository.js";
import { generateTicketId } from "../../utils/generateIds.js";
import { ApiError } from "../../utils/ApiError.js";

export interface TicketsQuery {
    search?: string;
    status?: string;
    page?: number;
    limit?: number;
}

export const createTicket = async (
    payload: { title: string; description: string },
    userId: string
) => {
    const ticket = await repo.createTicket({
        ticketId: generateTicketId(),
        title: payload.title,
        description: payload.description,
        createdBy: userId,
    });

    return ticket;
};

export const getTickets = async (
    user: { userId: string; role: string },
    query: TicketsQuery = {}
) => {
    // Customers only see their own tickets; agents/admins see all
    const baseFilter =
        user.role === "customer" ? { createdBy: user.userId } : {};

    return repo.findAll({
        baseFilter,
        search: query.search,
        status: query.status,
        page: query.page,
        limit: query.limit,
    });
};

export const getTicketById = async (id: string, user: { userId: string; role: string }) => {
    const ticket = await repo.findById(id);

    if (!ticket) {
        throw new ApiError(404, "Ticket not found");
    }

    // Customers can only view their own tickets
    if (user.role === "customer") {
        const ownerId = (ticket.createdBy as any)?._id?.toString() ?? ticket.createdBy.toString();

        if (ownerId !== user.userId) {
            throw new ApiError(403, "Forbidden: you can only view your own tickets");
        }
    }

    return ticket;
};

export const updateTicketStatus = async (id: string, status: string) => {
    const ticket = await repo.findById(id);

    if (!ticket) {
        throw new ApiError(404, "Ticket not found");
    }

    return repo.updateById(id, { status });
};

export const deleteTicket = async (id: string, user: { userId: string; role: string }) => {
    const ticket = await repo.findById(id);

    if (!ticket) {
        throw new ApiError(404, "Ticket not found");
    }

    // Admin can delete any ticket; others can only delete their own
    if (user.role !== "admin") {
        const ownerId = (ticket.createdBy as any)?._id?.toString() ?? ticket.createdBy.toString();

        if (ownerId !== user.userId) {
            throw new ApiError(403, "Forbidden: you are not allowed to delete this ticket");
        }
    }

    await repo.deleteById(id);
};
