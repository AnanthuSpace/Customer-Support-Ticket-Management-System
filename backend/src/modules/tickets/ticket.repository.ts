import Ticket from "../../models/ticket.model.js";

const POPULATE_USER = "name email role";

export interface TicketQuery {
    baseFilter?: Record<string, unknown>;
    search?: string;
    status?: string;
    page?: number;
    limit?: number;
    includeNote?: boolean;
}

export const createTicket = (payload: Record<string, unknown>) =>
    Ticket.create(payload);

export const findAll = async (options: TicketQuery = {}) => {
    const {
        baseFilter = {},
        search,
        status,
        page = 1,
        limit = 10,
        includeNote = false,
    } = options;

    // Start from the base filter (e.g. { createdBy } for customers)
    const query: Record<string, unknown> = { ...baseFilter };

    // Full-text search across title & description (case-insensitive)
    if (search) {
        query.$or = [
            { title: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
        ];
    }

    // Filter by status
    if (status) {
        query.status = status;
    }

    const skip = (page - 1) * limit;

    const ticketQuery = Ticket.find(query)
            .populate("createdBy", POPULATE_USER)
            .populate("assignedTo", POPULATE_USER)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

    if (!includeNote) {
        ticketQuery.select("-personalNote");
    }

    const [tickets, total] = await Promise.all([
        ticketQuery,
        Ticket.countDocuments(query),
    ]);

    return {
        tickets,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            hasNext: page * limit < total,
            hasPrev: page > 1,
        },
    };
};

export const findById = (id: string, includeNote = false) => {
    const query = Ticket.findById(id)
        .populate("createdBy", POPULATE_USER)
        .populate("assignedTo", POPULATE_USER);

    if (!includeNote) {
        query.select("-personalNote");
    }

    return query;
};

export const updateById = (id: string, update: Record<string, unknown>) =>
    Ticket.findByIdAndUpdate(id, update, { new: true })
        .populate("createdBy", POPULATE_USER)
        .populate("assignedTo", POPULATE_USER);

export const deleteById = (id: string) =>
    Ticket.findByIdAndDelete(id);

