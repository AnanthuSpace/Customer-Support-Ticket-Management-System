import Ticket, { TicketStatus } from "../../models/ticket.model.js";

export const getDashboardSummary = async (user: { userId: string; role: string }) => {
    const baseFilter: Record<string, unknown> =
        user.role === "customer" ? { createdBy: user.userId } : {};

    const totalTickets = await Ticket.countDocuments(baseFilter);
    const closedTickets = await Ticket.countDocuments({
        ...baseFilter,
        status: TicketStatus.CLOSED,
    });

    const statuses = {
        open: await Ticket.countDocuments({
            ...baseFilter,
            status: TicketStatus.OPEN,
        }),
        in_progress: await Ticket.countDocuments({
            ...baseFilter,
            status: TicketStatus.IN_PROGRESS,
        }),
        resolved: await Ticket.countDocuments({
            ...baseFilter,
            status: TicketStatus.RESOLVED,
        }),
        closed: closedTickets,
    };

    return {
        totalTickets,
        closedTickets,
        statuses,
    };
};
