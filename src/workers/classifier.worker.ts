import { Worker } from "bullmq";
import { classifyTicket } from "../services/ai.service.js";
import * as repo from "../modules/tickets/ticket.repository.js";
import { logger } from "../utils/logger.js";

const connection = { url: process.env.REDIS_URL || "redis://localhost:6379" };

type Payload = { id: number; title: string; description: string };

async function handle(job: { data: Payload }) {
  const { id, title, description } = job.data;
  const ai = await classifyTicket(title, description);
  await repo.updateClassification(id, ai);
}

// Create worker
export const worker = new Worker("classify", handle, { connection });

worker.on("ready", () => logger.info("Classifier worker ready"));
worker.on("completed", (job: any) => logger.info("Job completed", { jobId: job.id }));
worker.on("failed", (job: any, err: any) => logger.error("Job failed", { jobId: job?.id, err: err?.message ?? String(err) }));
