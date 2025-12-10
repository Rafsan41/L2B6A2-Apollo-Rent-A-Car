import { pool } from "../../config/db";

const createBooking = async (
  customer_id: number,
  vehicle_id: number,
  rent_start_date: string,
  rent_end_date: string,
  total_price: number,
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
    [customer_id, vehicle_id, rent_start_date, rent_end_date, status]
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
const updateSingleBooking = async (
  customer_id: string,
  vehicle_id: string,
  rent_start_date: string,
  rent_end_date: string,
  total_price: number,
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
};
