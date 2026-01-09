import express, { Request, Response } from "express";
import { userController } from "./user.controller";
import auth from "../../milddleware/auth";

const router = express.Router();

router.post("/", userController.createUser);

router.get("/", auth("admin"), userController.getAllUsers);

router.get("/:userId", auth("admin", "customer"), userController.getSingleUser);

router.put(
  "/:userId",
  auth("admin", "customer"),
  userController.updateSingleUser
);

router.delete("/:userId", auth("admin"), userController.deleteSingleUser);

export const userRoutes = router;
