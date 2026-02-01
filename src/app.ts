import express from "express";
import ticketRoutes from "./modules/tickets/ticket.routes.js";
import { errorHandler } from "./middleware/error.middleware.js";
import { pool } from "./config/db.js";

export const app = express();

app.use(express.json());
app.use("/tickets", ticketRoutes);
app.use(errorHandler);
