import request from "supertest";
import { app } from "../app.js";
import { pool } from "../config/db.js";

describe("Users API", () => {
  const unique = Date.now() + "_" + Math.floor(Math.random() * 100000);
  const testUser = { name: "Test User", email: `user_${unique}@example.com` };
  let createdId: number;

  it("creates a user and returns 201 with fields", async () => {
    const res = await request(app)
      .post("/users")
      .set("Content-Type", "application/json")
      .send(testUser);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body).toHaveProperty("name", testUser.name);
    expect(res.body).toHaveProperty("email", testUser.email);
    createdId = res.body.id;
  });

  it("lists users with pagination", async () => {
    const res = await request(app).get("/users").query({ limit: 10, offset: 0 });
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("gets a user by id", async () => {
    const res = await request(app).get(`/users/${createdId}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("id", createdId);
  });

  it("returns 404 for non-existent id", async () => {
    const res = await request(app).get("/users/999999999");
    expect(res.status).toBe(404);
  });

  it("returns 400 for invalid id param", async () => {
    const res = await request(app).get("/users/not-an-id");
    expect(res.status).toBe(400);
  });

  it("returns 400 for invalid body", async () => {
    const res = await request(app)
      .post("/users")
      .set("Content-Type", "application/json")
      .send({ name: "A", email: "not-an-email" });
    expect(res.status).toBe(400);
  });
  // Do not end the pool here; tickets.test.ts already ends it
});
