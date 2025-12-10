import express, { Request, Response } from "express";
import { pool } from "../../config/db";
import { bookingService } from "./booking.service";

const createBooking = async (req: Request, res: Response) => {
  const {
    customer_id,
    vehicle_id,
    rent_start_date,
    rent_end_date,
    total_price,
    status,
  } = req.body;

  try {
    const result = await bookingService.createBooking(
      customer_id,
      vehicle_id,
      rent_start_date,
      rent_end_date,
      total_price,
      status
    );
    res.status(201).json({ success: true, booking: result.rows[0] });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
};

const getAllbookings = async (req: Request, res: Response) => {
  try {
    const result = await bookingService.getAllbookings();
    res.status(200).json({ success: true, bookings: result.rows });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
};

const getSingleBooking = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await bookingService.getSingleBooking(id as string);

    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }

    res.status(200).json({ success: true, booking: result.rows[0] });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
};
const updateSingleBooking = async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    customer_id,
    vehicle_id,
    rent_start_date,
    rent_end_date,
    total_price,
    status,
  } = req.body;

  try {
    const result = await bookingService.updateSingleBooking(
      customer_id,
      vehicle_id,
      rent_start_date,
      rent_end_date,
      total_price,
      status,
      id as string
    );

    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }

    res.status(200).json({ success: true, booking: result.rows[0] });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
};

const deletedSingleBooking = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await bookingService.deletedSingleBooking(id as string);

    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }

    res.status(200).json({
      success: true,
      message: "Booking deleted successfully",
      deletedBooking: result.rows[0],
    });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
};
export const bookingController = {
  createBooking,
  getAllbookings,
  getSingleBooking,
  updateSingleBooking,
  deletedSingleBooking,
};
