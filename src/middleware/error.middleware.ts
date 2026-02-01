import type { NextFunction, Request, Response } from "express";

export function errorHandler(err: any, req: Request, res: Response, _next: NextFunction) {
  console.error(err);

  if (err.name === "ZodError") {
    return res.status(400).json({ error: "ValidationError", details: err.errors });
  }

  return res.status(500).json({ error: "InternalServerError", message: "Something went wrong" });
}
