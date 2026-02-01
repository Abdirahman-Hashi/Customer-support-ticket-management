import { randomUUID } from "node:crypto";

export type ClassificationJob = {
  id: string;
  title: string;
  description: string;
};

let queueInstance: any | null = null;

async function getQueue() {
  if (queueInstance) return queueInstance;
  const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";
  try {
    // Dynamically import bullmq only when queue is enabled
    const { Queue } = await import("bullmq");
    queueInstance = new Queue("classify", { connection: { url: redisUrl } });
    return queueInstance;
  } catch (e) {
    throw new Error(
      "BullMQ is not installed. Run `npm install bullmq` or set USE_QUEUE=false to disable async mode."
    );
  }
}

export async function enqueueClassification(payload: ClassificationJob) {
  const useQueue = String(process.env.USE_QUEUE).toLowerCase() === "true";
  if (!useQueue) return; // no-op when queue disabled

  const q = await getQueue();
  const jobId = randomUUID();
  await q.add("classify", payload, {
    jobId,
    removeOnComplete: 1000,
    removeOnFail: 1000,
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 2000,
    },
  });
}
