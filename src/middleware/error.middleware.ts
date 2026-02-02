import type { NextFunction, Request, Response } from "express";
import { HttpError } from "../utils/httpError.js";
import { logger } from "../utils/logger.js";

export function errorHandler(err: any, req: Request, res: Response, _next: NextFunction) {
  logger.error("Unhandled error", { err: err?.message ?? String(err), name: err?.name });

  if (err instanceof HttpError) {
    return res.status(err.status).json({ error: "HttpError", message: err.message });
  }

  if (err.name === "ZodError") {
    return res.status(400).json({ error: "ValidationError", details: err.errors });
  }

  return res.status(500).json({ error: "InternalServerError", message: "Something went wrong" });
}
