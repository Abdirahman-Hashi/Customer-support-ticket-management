import { Router } from "express";
import * as ctrl from "./ticket.controller.js";
import { validate } from "../../middleware/validate.middleware.js";
import { createTicketSchema, idParamSchema, listQuerySchema } from "./ticket.validator.js";

const router = Router();

router.post("/", validate({ body: createTicketSchema }), ctrl.createTicket);
router.get("/", validate({ query: listQuerySchema }), ctrl.listTickets);
router.get("/:id", validate({ params: idParamSchema }), ctrl.getTicketById);

export default router;
