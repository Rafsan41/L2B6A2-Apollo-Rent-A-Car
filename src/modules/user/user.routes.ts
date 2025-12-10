import express, { Request, Response } from "express";
import { userController } from "./user.controller";
import logger from "../../milddleware/logger";
import auth from "../../milddleware/auth";

const router = express.Router();

router.post("/", userController.createUser);

router.get("/", logger, auth(), userController.getAllUsers);

router.get("/:id", userController.getSingleUser);

router.put("/:id", userController.updateSingleUser);

router.delete("/:id", userController.deleteSingleUser);

export const userRoutes = router;
