import * as repo from "./ticket.repository.js";
import { classifyTicket } from "../../services/ai.service.js";
import { enqueueClassification } from "../../queue/index.js";
import { HttpError } from "../../utils/httpError.js";
import * as userRepo from "../users/user.repository.js";

export async function createTicket(data: any) {
  // Always prefer the user named 'admin' as the creator when present
  const admin = await userRepo.getUserByName("admin");
  const creatorId = admin?.id ?? null;
  const created = await repo.insertTicket({
    title: data.title,
    description: data.description,
    category: null,
    priority: null,
    ai_confidence: null,
    ai_status: "pending",
    created_by: creatorId,
  });
  const id: number = created.id;

  // Optional async classification via queue
  if (String(process.env.USE_QUEUE).toLowerCase() === "true") {
    await enqueueClassification({ id, title: data.title, description: data.description });
    return repo.getTicketById(id);
  }

  // Default: classify synchronously in request path
  const ai = await classifyTicket(data.title, data.description);
  await repo.updateClassification(id, ai);

  return repo.getTicketById(id);
}

export async function getTicketById(id: number) {
  const ticket = await repo.getTicketById(id);
  if (!ticket) throw new HttpError(404, "Not found");
  return ticket;
}
export const getTicket = getTicketById;
export const listTickets = repo.listTickets;
