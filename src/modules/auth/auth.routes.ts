import { Router } from "express";
import { authController } from "./auth.controller";

const router = Router();

// Public routes
router.post("/signup", authController.signUpUser);
router.post("/signin", authController.signInUser);

export const authRoutes = router;
