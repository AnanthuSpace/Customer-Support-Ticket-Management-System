import { z } from "zod";

export const createTicketSchema = z.object({
    title: z
        .string()
        .min(3, "Title must be at least 3 characters")
        .max(200, "Title must be at most 200 characters"),

    description: z
        .string()
        .min(10, "Description must be at least 10 characters"),
});

export const updateStatusSchema = z.object({
    status: z.enum(["open", "in_progress", "resolved", "closed"] as const),
});

export const updateNoteSchema = z.object({
    note: z.string().min(1, "Note cannot be empty").max(1000, "Note must be at most 1000 characters"),
});

export const updateAssignmentSchema = z.object({
    assignedTo: z.string().min(1, "Please select an agent to assign the ticket to"),
});
