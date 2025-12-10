import express, { Request, Response } from "express";
import { pool } from "../../config/db";
import { vehicleController } from "./vehicle.controller";

const router = express.Router();

router.post("/", vehicleController.createVehicle);

router.get("/", vehicleController.getAllvehicles);

router.get("/:id", vehicleController.getSingleVehicle);

router.put("/:id", vehicleController.updateSingleVehicle);

router.delete("/:id", vehicleController.deletedSingleVehicle);

export const vechiclRoutes = router;
