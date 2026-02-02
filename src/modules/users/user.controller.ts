import type { Request, Response, NextFunction } from "express";
import * as service from "./user.service.js";

export async function createUser(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await service.createUser(req.body);
    res.status(201).json(user);
  } catch (e) {
    next(e);
  }
}

export async function getUserById(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params as any;
    const user = await service.getUserById(id);
    res.json(user);
  } catch (e) {
    next(e);
  }
}

export async function listUsers(req: Request, res: Response, next: NextFunction) {
  try {
    const { limit, offset } = req.query as any;
    const users = await service.listUsers(limit, offset);
    res.json(users);
  } catch (e) {
    next(e);
  }
}
