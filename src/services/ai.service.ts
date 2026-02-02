import OpenAI from "openai";
import { z } from "zod";
import { logger } from "../utils/logger.js";

const aiSchema = z.object({
  category: z.enum(["billing", "technical", "general"]),
  priority: z.enum(["low", "medium", "high"]),
  confidence: z.number().min(0).max(1),
});

export type AIClassification = z.infer<typeof aiSchema>;

export async function classifyTicket(
  title: string,
  description: string
): Promise<AIClassification & { fallback?: boolean }> {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error("OPENAI_API_KEY not set");
    }
    const client = new OpenAI({ apiKey });
    const model = process.env.AI_MODEL || "gpt-4o-mini";
    const timeout = Number(process.env.AI_TIMEOUT_MS || 8000);
    const response = await client.chat.completions.create(
      {
        // Use a current, widely available model
        model,
        temperature: 0,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: "You are a support ticket classifier. Respond ONLY with valid JSON." },
          {
            role: "user",
            content: `Classify this support ticket.\n\nReturn JSON with EXACTLY these fields:\n- category: billing | technical | general\n- priority: low | medium | high\n- confidence: number between 0 and 1\n\nTicket:\nTitle: ${title}\nDescription: ${description}`,
          },
        ],
      },
      { timeout }
    );

    const content = response.choices?.[0]?.message?.content;
    if (!content) throw new Error("Empty AI response");

    const parsed = aiSchema.parse(JSON.parse(content));
    return parsed;
  } catch (error) {
    // Improve diagnostics without leaking secrets
    const anyErr = error as any;
    const status = anyErr?.status ?? anyErr?.response?.status;
    const data = anyErr?.response?.data ?? anyErr?.error ?? anyErr?.message;
    logger.error("AI classification failed", { status, data });
    return { category: "general", priority: "medium", confidence: 0, fallback: true };
  }
}
