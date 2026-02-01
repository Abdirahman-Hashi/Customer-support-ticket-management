import type { Request, Response, NextFunction } from "express";
import * as service from "./ticket.service.js";
import { createTicketSchema, idParamSchema, listQuerySchema } from "./ticket.validator.js";
import { HttpError } from "../../utils/httpError.js";

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const data = createTicketSchema.parse(req.body);
    const ticket = await service.createTicket(data);
    res.status(201).json(ticket);
  } catch (e) {
    next(e);
  }
}

export async function getOne(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = idParamSchema.parse(req.params);
    const ticket = await service.getTicket(id);
    if (!ticket) throw new HttpError(404, "Not found");
    res.json(ticket);
  } catch (e) {
    next(e);
  }
}

export async function list(req: Request, res: Response, next: NextFunction) {
  try {
    const query = listQuerySchema.parse(req.query);
    const tickets = await service.listTickets(query);
    res.json(tickets);
  } catch (e) {
    next(e);
  }
}
