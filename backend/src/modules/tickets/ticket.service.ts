import * as repo from "./ticket.repository.js";
import * as userRepo from "../users/user.repository.js";
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

const canViewPersonalNote = (role: string) =>
    role === "admin" || role === "agent";

const getBaseTicketFilter = (user: { userId: string; role: string }) => {
    if (user.role === "customer") {
        return { createdBy: user.userId };
    }

    if (user.role === "agent") {
        return { assignedTo: user.userId };
    }

    return {};
};

export const getTickets = async (
    user: { userId: string; role: string },
    query: TicketsQuery = {}
) => {
    const baseFilter = getBaseTicketFilter(user);

    return repo.findAll({
        baseFilter,
        search: query.search,
        status: query.status,
        page: query.page,
        limit: query.limit,
        includeNote: canViewPersonalNote(user.role),
    });
};

const extractUserIdFromRef = (ref: unknown) => {
    if (!ref) return null;
    if (typeof ref === "string") return ref;
    if (typeof ref === "object" && ref !== null && "_id" in ref) {
        return (ref as any)._id?.toString();
    }
    return null;
};

export const getTicketById = async (id: string, user: { userId: string; role: string }) => {
    const ticket = await repo.findById(id, canViewPersonalNote(user.role));

    if (!ticket) {
        throw new ApiError(404, "Ticket not found");
    }

    if (user.role === "customer") {
        const ownerId = extractUserIdFromRef(ticket.createdBy);
        if (ownerId !== user.userId) {
            throw new ApiError(403, "Forbidden: you can only view your own tickets");
        }
    }

    if (user.role === "agent") {
        const assignedAgentId = extractUserIdFromRef(ticket.assignedTo);
        if (assignedAgentId !== user.userId) {
            throw new ApiError(403, "Forbidden: you can only view tickets assigned to you");
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

export const updateNote = async (id: string, note: string) => {
    const ticket = await repo.findById(id, true);

    if (!ticket) {
        throw new ApiError(404, "Ticket not found");
    }

    return repo.updateById(id, { personalNote: note });
};

export const updateTicketAssignment = async (id: string, assignedTo: string) => {
    let user = await userRepo.findById(assignedTo);
    if (!user) {
        user = await userRepo.findByUserId(assignedTo);
    }
    if (!user || (user as any).role !== "agent") {
        throw new ApiError(400, "Assigned user must be a valid agent");
    }

    const ticket = await repo.findById(id);
    if (!ticket) {
        throw new ApiError(404, "Ticket not found");
    }

    return repo.updateById(id, { assignedTo });
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
