import { Router } from "express";
import * as ctrl from "./ticket.controller.js";

const router = Router();

router.post("/", ctrl.create);
router.get("/", ctrl.list);
router.get("/:id", ctrl.getOne);

export default router;
