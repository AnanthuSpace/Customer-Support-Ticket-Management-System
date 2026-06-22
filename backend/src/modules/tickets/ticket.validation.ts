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
    status: z.enum(["open", "in_progress", "resolved", "closed"], {
        errorMap: () => ({
            message:
                "Status must be one of: open, in_progress, resolved, closed",
        }),
    }),
});
