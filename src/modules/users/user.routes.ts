import { Router } from "express";
import * as ctrl from "./user.controller.js";
import { validate } from "../../middleware/validate.middleware.js";
import { createUserSchema, idParamSchema, listQuerySchema } from "./user.validator.js";

const router = Router();

router.post("/", validate({ body: createUserSchema }), ctrl.createUser);
router.get("/", validate({ query: listQuerySchema }), ctrl.listUsers);
router.get("/:id", validate({ params: idParamSchema }), ctrl.getUserById);

export default router;
