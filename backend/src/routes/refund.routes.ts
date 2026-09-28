import { Router } from "express";
import { createRefund, listRefunds } from "../controllers/refund.controller";

const router = Router();
router.post("/", createRefund);
router.get("/", listRefunds);

export default router;
