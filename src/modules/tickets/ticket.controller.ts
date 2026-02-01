import type { Request, Response, NextFunction } from "express";
import * as service from "./ticket.service.js";
import { createTicketSchema } from "./ticket.validator.js";
import { pool } from "../../config/db.js";

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    // debug log
    console.log("POST /tickets - incoming body", req.body);
    const data = createTicketSchema.parse(req.body);
    const ticket = await service.createTicket(data);
    res.status(201).json(ticket);
  } catch (e) {
    console.error("POST /tickets failed:", e);
    next(e);
  }
}

export async function getOne(req: Request, res: Response, next: NextFunction) {
  try {
    const id = String(req.params.id);
    const ticket = await service.getTicket(id);
    if (!ticket) return res.status(404).json({ error: "Not found" });
    res.json(ticket);
  } catch (e) {
    next(e);
  }
}

export async function list(req: Request, res: Response, next: NextFunction) {
  try {
    const tickets = await service.listTickets(req.query);
    res.json(tickets);
  } catch (e) {
    next(e);
  }
}

export async function health(_req: Request, res: Response) {
  res.json({ status: "ok" });
}

export async function dbping(_req: Request, res: Response, next: NextFunction) {
  try {
    const { rows } = await pool.query("SELECT 1 as ok");
    res.json({ db: rows[0]?.ok === 1 ? "ok" : rows[0] });
  } catch (e) {
    next(e);
  }
}
