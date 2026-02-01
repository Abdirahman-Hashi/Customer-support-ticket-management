import { z } from "zod";

export const createTicketSchema = z.object({
  title: z.string().min(5),
  description: z.string().min(10),
});

export const idParamSchema = z.object({
  id: z.string().uuid(),
});

const categoryEnum = z.enum(["billing", "technical", "general"]);
const priorityEnum = z.enum(["low", "medium", "high"]);
const statusEnum = z.enum(["open", "closed"]);

// Parse numbers that arrive as query strings
const toNumber = (v: unknown) =>
  typeof v === "string" && v.trim() !== "" ? Number(v) : v;

export const listQuerySchema = z.object({
  category: categoryEnum.optional(),
  priority: priorityEnum.optional(),
  status: statusEnum.optional(),
  limit: z.preprocess(toNumber, z.number().int().min(1).max(100)).default(50),
  offset: z.preprocess(toNumber, z.number().int().min(0)).default(0),
});
