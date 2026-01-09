import { pool } from "../../config/db";

const createBooking = async (
  customer_id: number,
  vehicle_id: number,
  rent_start_date: string,
  rent_end_date: string,
  status: string
) => {
  const result = await pool.query(
    `
  INSERT INTO bookings (
    customer_id,
    vehicle_id,
    rent_start_date,
    rent_end_date,
    total_price,
    status
  )
  SELECT 
    $1,
    $2,
    $3::date,
    $4::date,
    (v.daily_rent_price * (($4::date) - ($3::date))),
    $5
  FROM vehicles v
  WHERE v.id = $2
  RETURNING *;
  `,
    [customer_id, vehicle_id, rent_start_date, rent_end_date, status] // ✅ Fixed: 5 parameters
  );
  return result;
};

const getAllbookings = async () => {
  const result = await pool.query("SELECT * FROM bookings ORDER BY id ASC");
  return result;
};

const getSingleBooking = async (id: string) => {
  const result = await pool.query("SELECT * FROM bookings WHERE id = $1", [id]);
  return result;
};

// ✅ Added: Get bookings for admin (with customer and vehicle details)
const getAllBookingsAdmin = async () => {
  const result = await pool.query(`
    SELECT 
      b.*,
      u.name as customer_name,
      u.email as customer_email,
      v.vehicle_name,
      v.registration_number,
      v.type
    FROM bookings b
    JOIN users u ON b.customer_id = u.id
    JOIN vehicles v ON b.vehicle_id = v.id
    ORDER BY b.id ASC
  `);
  return result;
};

// ✅ Added: Get bookings for specific user
const getUserBookings = async (user_id: number) => {
  const result = await pool.query(
    `
    SELECT 
      b.*,
      v.vehicle_name,
      v.registration_number,
      v.type
    FROM bookings b
    JOIN vehicles v ON b.vehicle_id = v.id
    WHERE b.customer_id = $1
    ORDER BY b.id ASC
  `,
    [user_id]
  );
  return result;
};

// ✅ Added: Get single booking for admin (with details)
const getSingleBookingAdmin = async (id: string) => {
  const result = await pool.query(
    `
    SELECT 
      b.*,
      u.name as customer_name,
      u.email as customer_email,
      v.vehicle_name,
      v.registration_number
    FROM bookings b
    JOIN users u ON b.customer_id = u.id
    JOIN vehicles v ON b.vehicle_id = v.id
    WHERE b.id = $1
  `,
    [id]
  );
  return result;
};

// ✅ Added: Get single booking for user
const getUserSingleBooking = async (id: string, user_id: number) => {
  const result = await pool.query(
    `
    SELECT 
      b.*,
      v.vehicle_name,
      v.registration_number,
      v.type
    FROM bookings b
    JOIN vehicles v ON b.vehicle_id = v.id
    WHERE b.id = $1 AND b.customer_id = $2
  `,
    [id, user_id]
  );
  return result;
};

const updateSingleBooking = async (
  customer_id: string,
  vehicle_id: string,
  rent_start_date: string,
  rent_end_date: string,
  status: string,
  id: string
) => {
  const result = await pool.query(
    `
  UPDATE bookings b
  SET
    customer_id = $1,
    vehicle_id = $2,
    rent_start_date = $3::date,
    rent_end_date = $4::date,
    total_price = (
      SELECT v.daily_rent_price * (($4::date) - ($3::date))
      FROM vehicles v
      WHERE v.id = $2
    ),
    status = $5
  WHERE b.id = $6
  RETURNING *;
  `,
    [customer_id, vehicle_id, rent_start_date, rent_end_date, status, id]
  );
  return result;
};

// ✅ Added: Update only booking status (for customer cancellation/admin return)
const updateBookingStatus = async (
  id: string,
  status: string,
  role?: string
) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Get booking details first
    const booking = await client.query(
      `SELECT vehicle_id FROM bookings WHERE id = $1`,
      [id]
    );

    if (booking.rows.length === 0) {
      throw new Error("Booking not found");
    }

    const vehicle_id = booking.rows[0].vehicle_id;

    // Update booking status
    const result = await client.query(
      `UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *`,
      [status, id]
    );

    // If booking is cancelled or returned, update vehicle status
    if (status === "cancelled" || status === "returned") {
      await client.query(
        `UPDATE vehicles SET availability_status = 'available' WHERE id = $1`,
        [vehicle_id]
      );
    }

    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

const deletedSingleBooking = async (id: string) => {
  const result = await pool.query(
    "DELETE FROM bookings WHERE id = $1 RETURNING *",
    [id]
  );
  return result;
};

export const bookingService = {
  createBooking,
  getAllbookings,
  getSingleBooking,
  updateSingleBooking,
  deletedSingleBooking,
  // ✅ Added new methods for role-based access
  getAllBookingsAdmin,
  getUserBookings,
  getSingleBookingAdmin,
  getUserSingleBooking,
  updateBookingStatus,
};
