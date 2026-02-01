import express from "express";
import ticketRoutes from "./modules/tickets/ticket.routes.js";
import { errorHandler } from "./middleware/error.middleware.js";
import swaggerUi from "swagger-ui-express";
import YAML from "yaml";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

export const app = express();

app.use(express.json());
// Swagger UI
const openapiPath = resolve(process.cwd(), "openapi.yaml");
const openapiDoc = YAML.parse(readFileSync(openapiPath, "utf8"));
app.get("/docs.json", (_req, res) => res.json(openapiDoc));
app.use("/docs", swaggerUi.serve, swaggerUi.setup(openapiDoc));
app.use("/tickets", ticketRoutes);
app.use(errorHandler);
