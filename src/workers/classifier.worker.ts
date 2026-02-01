import { Worker, Job } from "bullmq";
import { classifyTicket } from "../services/ai.service.js";
import * as repo from "../modules/tickets/ticket.repository.js";

const connection = { url: process.env.REDIS_URL || "redis://localhost:6379" };

async function handle(job: Job<{ id: string; title: string; description: string }>) {
  const { id, title, description } = job.data;
  const ai = await classifyTicket(title, description);
  await repo.updateClassification(id, ai);
}

// Create worker
export const worker = new Worker("classify", handle, { connection });

worker.on("ready", () => console.log("Classifier worker ready"));
worker.on("completed", (job) => console.log("Completed job", job.id));
worker.on("failed", (job, err) => console.error("Job failed", job?.id, err));
