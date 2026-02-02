import express from "express";
import ticketRoutes from "./modules/tickets/ticket.routes.js";
import { errorHandler } from "./middleware/error.middleware.js";
import swaggerUi from "swagger-ui-express";
import YAML from "yaml";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { apiLimiter } from "./middleware/rateLimiter.js";
import userRoutes from "./modules/users/user.routes.js";

export const app = express();

app.use(express.json());
// Global rate limit
app.use(apiLimiter);
// Swagger UI
const openapiPath = resolve(process.cwd(), "openapi.yaml");
const openapiDoc = YAML.parse(readFileSync(openapiPath, "utf8"));
app.get("/docs.json", (_req, res) => res.json(openapiDoc));
app.use("/docs", swaggerUi.serve, swaggerUi.setup(openapiDoc));
app.use("/users", userRoutes);
app.use("/tickets", ticketRoutes);
app.use(errorHandler);
