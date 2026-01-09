import express, { Request, Response } from "express";

import { bookingController } from "./booking.controller";
import auth from "../../milddleware/auth";

const router = express.Router();

router.post("/", auth("admin", "customer"), bookingController.createBooking);

router.get("/", auth("admin", "customer"), bookingController.getAllbookings);

router.get(
  "/:bookingId",
  auth("admin", "customer"),
  bookingController.getSingleBooking
);

router.put(
  "/:bookingId",
  auth("admin", "customer"),
  bookingController.updateSingleBooking
);

router.delete(
  "/:bookingId",
  auth("admin", "customer"),
  bookingController.deletedSingleBooking
);

export const bookinglRoutes = router;
