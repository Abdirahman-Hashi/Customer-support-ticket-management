import { v4 as uuid } from "uuid";
import * as repo from "./ticket.repository.js";
import { classifyTicket } from "../../services/ai.service.js";

export async function createTicket(data: any) {
  const id = uuid();

  await repo.insertTicket({
    id,
    title: data.title,
    description: data.description,
    category: null,
    priority: null,
    ai_confidence: null,
    ai_status: "pending",
  });

  const ai = await classifyTicket(data.title, data.description);
  await repo.updateClassification(id, ai);

  return repo.getTicketById(id);
}

export const getTicket = repo.getTicketById;
export const listTickets = repo.listTickets;
