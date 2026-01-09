import express, { Request, Response } from "express";
import { pool } from "../../config/db";
import { vehicleController } from "./vehicle.controller";
import auth from "../../milddleware/auth";

const router = express.Router();

router.post("/", auth("admin"), vehicleController.createVehicle);

router.get("/", vehicleController.getAllvehicles);

router.get("/:vehicleId", vehicleController.getSingleVehicle);

router.put("/:vehicleId", auth("admin"), vehicleController.updateSingleVehicle);

router.delete(
  "/:vehicleId",
  auth("admin"),
  vehicleController.deletedSingleVehicle
);

export const vechiclRoutes = router;
