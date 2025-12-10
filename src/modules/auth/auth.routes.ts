import { Router } from "express";
import { authController } from "./auth.controller";
import auth from "../../milddleware/auth";
import logger from "../../milddleware/logger";

const router = Router();
// /api/v1/auth/signup
router.post("/signup", authController.logInUser);
// router.post("/signin");

export const authRoutes = router;
