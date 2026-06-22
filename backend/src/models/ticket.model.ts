import { Schema, model, Types } from "mongoose";

export enum TicketStatus {
    OPEN = "open",
    IN_PROGRESS = "in_progress",
    RESOLVED = "resolved",
    CLOSED = "closed",
}

const ticketSchema = new Schema(
    {
        ticketId: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },

        title: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            required: true,
            trim: true,
        },

        status: {
            type: String,
            enum: Object.values(TicketStatus),
            default: TicketStatus.OPEN,
        },

        createdBy: {
            type: Types.ObjectId,
            ref: "User",
            required: true,
        },

        assignedTo: {
            type: Types.ObjectId,
            ref: "User",
            default: null,
        },
        personalNote: {
            type: String,
            trim: true,
            default: "",
        },
    },
    {
        timestamps: true,
    }
);

const Ticket = model("Ticket", ticketSchema);
export default Ticket;