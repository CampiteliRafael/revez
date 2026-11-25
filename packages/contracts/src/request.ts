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
});

export type CreateRequestInput = z.infer<typeof createRequestSchema>;

export const listRequestsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

export type ListRequestsQuery = z.infer<typeof listRequestsQuerySchema>;
