import { Router } from "express";
import { calSize } from "../controllers/size.js";

const router = Router();

// router.get("/getSizeGet", getRoute);
router.post("/getSize", calSize);

export default router;
