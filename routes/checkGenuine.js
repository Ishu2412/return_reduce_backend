import { Router } from "express";

import { check } from "../controllers/checkGenuine.js";

const router = Router();

router.post("/check", check);

export default router;
