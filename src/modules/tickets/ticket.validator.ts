import { z } from "zod";

export const createTicketSchema = z.object({
  title: z.string().min(5),
  description: z.string().min(10),
});
