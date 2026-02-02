import type { Request, Response, NextFunction } from "express";
import * as service from "./ticket.service.js";

export async function createTicket(req: Request, res: Response, next: NextFunction) {
  try {
    const ticket = await service.createTicket(req.body);
    res.status(201).json(ticket);
  } catch (e) {
    next(e);
  }
}

export async function getTicketById(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params as any;
    const ticket = await service.getTicketById(id);
    res.json(ticket);
  } catch (e) {
    next(e);
  }
}

export async function listTickets(req: Request, res: Response, next: NextFunction) {
  try {
    const tickets = await service.listTickets(req.query as any);
    res.json(tickets);
  } catch (e) {
    next(e);
  }
}
