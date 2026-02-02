import request from "supertest";
import { app } from "../app.js";
import { pool } from "../config/db.js";

// Force AI fallback for deterministic tests by clearing the key in process env
beforeAll(() => {
  delete (process as any).env.OPENAI_API_KEY;
});

describe("Tickets API", () => {
  it("creates a ticket and returns 201 with required fields", async () => {
    const res = await request(app)
      .post("/tickets")
      .set("Content-Type", "application/json")
      .send({ title: "Payment failed", description: "Card charged but order did not complete" });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body).toHaveProperty("title", "Payment failed");
    expect(res.body).toHaveProperty("description");
    expect(["fallback", "done"]).toContain(res.body.ai_status);
  });

  it("returns 400 on invalid body (too short)", async () => {
    const res = await request(app)
      .post("/tickets")
      .set("Content-Type", "application/json")
      .send({ title: "shrt", description: "tiny" });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("ValidationError");
  });

  it("lists tickets with pagination", async () => {
    // create 3 tickets
    for (let i = 0; i < 3; i++) {
      await request(app)
        .post("/tickets")
        .set("Content-Type", "application/json")
        .send({ title: `T${i} - installation failed`, description: `Desc ${i} long enough........` });
    }

    const res = await request(app).get("/tickets").query({ limit: 2, offset: 1 });
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(2);
  });

  it("returns 404 for non-existent id", async () => {
    const res = await request(app).get("/tickets/999999999");
    expect(res.status).toBe(404);
  });

  it("returns 400 for invalid id param", async () => {
    const res = await request(app).get("/tickets/not-a-id");
    expect(res.status).toBe(400);
  });

  it("returns 400 for invalid query enum", async () => {
    const res = await request(app).get("/tickets").query({ category: "weird" });
    expect(res.status).toBe(400);
  });

  afterAll(async () => {
    await pool.end();
  });
});
