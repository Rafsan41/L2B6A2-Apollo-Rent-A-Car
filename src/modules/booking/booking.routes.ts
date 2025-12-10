import express, { Request, Response } from "express";

import { bookingController } from "./booking.controller";

const router = express.Router();

router.post("/", bookingController.createBooking);

router.get("/", bookingController.getAllbookings);

router.get("/:id", bookingController.getSingleBooking);

router.put("/:id", bookingController.updateSingleBooking);

router.delete("/:id", bookingController.deletedSingleBooking);

export const bookinglRoutes = router;
