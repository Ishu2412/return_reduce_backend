import { Router } from "express";
import { login } from "../controllers/authentication/login.js";
import { register } from "../controllers/authentication/signup.js";

const router = Router();
router.post("/login", login);
router.post("/signup", register);

export default router;
