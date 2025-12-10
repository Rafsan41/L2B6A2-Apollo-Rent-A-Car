import express, { Request, Response } from "express";
import { pool } from "../../config/db";
import { vehicleService } from "./vehicle.service";
const createVehicle = async (req: Request, res: Response) => {
  const {
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status,
  } = req.body;

  try {
    const result = await vehicleService.createVehicle(
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status
    );

    res.status(201).json({ success: true, vehicle: result.rows[0] });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
};

const getAllvehicles = async (req: Request, res: Response) => {
  try {
    const result = await vehicleService.getAllvehicles();
    res.status(200).json({ success: true, vehicles: result.rows });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
};

const getSingleVehicle = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await vehicleService.getSingleVehicle(id as string);

    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Vehicle not found" });
    }

    res.status(200).json({ success: true, vehicle: result.rows[0] });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
};
const updateSingleVehicle = async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status,
  } = req.body;

  try {
    const result = await vehicleService.updateSingleVehicle(
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
      id as string
    );

    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Vehicle not found" });
    }

    res.status(200).json({ success: true, vehicle: result.rows[0] });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
};

const deletedSingleVehicle = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await vehicleService.deletedSingleVehicle(id as string);

    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Vehicle not found" });
    }

    res.status(200).json({
      success: true,
      message: "Vehicle deleted successfully",
      deletedVehicle: result.rows[0],
    });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
};
export const vehicleController = {
  createVehicle,
  getAllvehicles,
  getSingleVehicle,
  updateSingleVehicle,
  deletedSingleVehicle,
};
