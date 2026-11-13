import { z } from "zod";

export const createRequestSchema = z.object({
  title: z.string().trim().min(1),
  description: z.string().trim().min(1),
  category: z.enum([
    "IT",
    "INFRASTRUCTURE",
    "ADMINISTRATIVE",
    "PURCHASES",
    "HR",
  ]),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
  dueDate: z.iso.date(),
  assigneeId: z.string().trim().min(1),
  teamId: z.string().trim().min(1),
});

export type CreateRequestInput = z.infer<typeof createRequestSchema>;