import { Request, Response } from "express";
import { bookingService } from "./booking.service";

const createBooking = async (req: Request, res: Response) => {
  const { customer_id, vehicle_id, rent_start_date, rent_end_date } = req.body;

  try {
    // ✅ Validate required fields
    if (!customer_id || !vehicle_id || !rent_start_date || !rent_end_date) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
        errors:
          "customer_id, vehicle_id, rent_start_date, and rent_end_date are required",
      });
    }

    const loggedInUser = req.user;

    // ✅ Convert to numbers for comparison
    if (
      loggedInUser?.role === "customer" &&
      loggedInUser?.user_id !== parseInt(customer_id)
    ) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Customers can only create bookings for themselves",
      });
    }

    // ✅ Pass 'active' as default status, NOT from request body
    const result = await bookingService.createBooking(
      parseInt(customer_id),
      parseInt(vehicle_id),
      rent_start_date,
      rent_end_date,
      "active" // ✅ Default status, not from request
    );

    // ✅ CORRECT RESPONSE FORMAT
    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: {
        id: result.rows[0].id,
        customer_id: result.rows[0].customer_id,
        vehicle_id: result.rows[0].vehicle_id,
        rent_start_date: result.rows[0].rent_start_date,
        rent_end_date: result.rows[0].rent_end_date,
        total_price: result.rows[0].total_price,
        status: result.rows[0].status,
        vehicle: {
          vehicle_name: result.rows[0].vehicle_name,
          daily_rent_price: result.rows[0].daily_rent_price,
        },
      },
    });
  } catch (err: any) {
    console.error(err);

    // ✅ Handle specific errors
    if (err.message.includes("not available")) {
      return res.status(400).json({
        success: false,
        message: "Vehicle not available for booking",
        errors: err.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
      errors: err.message,
    });
  }
};

const getAllbookings = async (req: Request, res: Response) => {
  try {
    const loggedInUser = req.user;
    let result;

    // ✅ ROLE-BASED ACCESS
    if (loggedInUser?.role === "admin") {
      result = await bookingService.getAllBookingsAdmin();
    } else {
      result = await bookingService.getUserBookings(loggedInUser?.user_id);
    }

    // ✅ CORRECT RESPONSE FORMAT
    const message =
      result.rows.length > 0
        ? loggedInUser?.role === "admin"
          ? "Bookings retrieved successfully"
          : "Your bookings retrieved successfully"
        : "No bookings found";

    res.status(200).json({
      success: true,
      message,
      data: result.rows, // ✅ Changed from "bookings" to "data"
    });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      errors: err.message, // ✅ Changed from "error" to "errors"
    });
  }
};

const getSingleBooking = async (req: Request, res: Response) => {
  const { bookingId } = req.params;

  try {
    const loggedInUser = req.user;
    let result;

    // ✅ ROLE-BASED QUERY
    if (loggedInUser?.role === "admin") {
      result = await bookingService.getSingleBookingAdmin(bookingId as string);
    } else {
      result = await bookingService.getUserSingleBooking(
        bookingId as string,
        loggedInUser?.user_id
      );
    }

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // ✅ Check if customer owns this booking
    if (loggedInUser?.role === "customer") {
      const booking = result.rows[0];
      if (booking.customer_id !== loggedInUser.user_id) {
        return res.status(403).json({
          success: false,
          message: "Forbidden: You can only access your own bookings",
        });
      }
    }

    // ✅ CORRECT RESPONSE FORMAT
    res.status(200).json({
      success: true,
      message: "Booking retrieved successfully",
      data: result.rows[0], // ✅ Changed from "booking" to "data"
    });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      errors: err.message, // ✅ Changed from "error" to "errors"
    });
  }
};

const updateSingleBooking = async (req: Request, res: Response) => {
  const { bookingId } = req.params;
  const { status } = req.body; // ✅ Only status should be updated

  try {
    // ✅ Validate status field
    if (!status || !["cancelled", "returned"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
        errors: "Status must be either 'cancelled' or 'returned'",
      });
    }

    const loggedInUser = req.user;

    // ✅ ROLE-BASED PERMISSIONS
    if (loggedInUser?.role === "customer") {
      if (status !== "cancelled") {
        return res.status(403).json({
          success: false,
          message: "Forbidden: Customers can only cancel bookings",
        });
      }

      // Check if customer owns this booking
      const bookingCheck = await bookingService.getSingleBooking(
        bookingId as string
      );
      if (bookingCheck.rowCount === 0) {
        return res.status(404).json({
          success: false,
          message: "Booking not found",
        });
      }

      const booking = bookingCheck.rows[0];
      if (booking.customer_id !== loggedInUser.user_id) {
        return res.status(403).json({
          success: false,
          message: "Forbidden: You can only update your own bookings",
        });
      }
    }

    // ✅ Use updateBookingStatus for proper business logic
    const result = await bookingService.updateBookingStatus(
      bookingId as string,
      status,
      loggedInUser?.role
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // ✅ CORRECT RESPONSE FORMAT
    const message =
      status === "cancelled"
        ? "Booking cancelled successfully"
        : "Booking marked as returned. Vehicle is now available";

    const responseData = {
      id: result.rows[0].id,
      customer_id: result.rows[0].customer_id,
      vehicle_id: result.rows[0].vehicle_id,
      rent_start_date: result.rows[0].rent_start_date,
      rent_end_date: result.rows[0].rent_end_date,
      total_price: result.rows[0].total_price,
      status: result.rows[0].status,
    };

    if (status === "returned") {
      responseData.status = {
        status: "available",
      };
    }

    res.status(200).json({
      success: true,
      message,
      data: responseData, // ✅ Changed from "booking" to "data"
    });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      errors: err.message, // ✅ Changed from "error" to "errors"
    });
  }
};

const deletedSingleBooking = async (req: Request, res: Response) => {
  const { bookingId } = req.params;

  try {
    // ✅ Check permissions (only admin should delete)
    const loggedInUser = req.user;
    if (loggedInUser?.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Only admin can delete bookings",
      });
    }

    // ✅ Check if booking exists
    const bookingCheck = await bookingService.getSingleBooking(
      bookingId as string
    );
    if (bookingCheck.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // ✅ Check if booking is active (should be cancelled/returned first)
    if (bookingCheck.rows[0].status === "active") {
      return res.status(400).json({
        success: false,
        message: "Cannot delete active booking",
        errors: "Cancel or return the booking before deletion",
      });
    }

    const result = await bookingService.deletedSingleBooking(
      bookingId as string
    );

    // ✅ CORRECT RESPONSE FORMAT
    res.status(200).json({
      success: true,
      message: "Booking deleted successfully",
      // ✅ No "deletedBooking" field - just message
    });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      errors: err.message, // ✅ Changed from "error" to "errors"
    });
  }
};

export const bookingController = {
  createBooking,
  getAllbookings,
  getSingleBooking,
  updateSingleBooking,
  deletedSingleBooking,
};
