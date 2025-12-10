import { pool } from "../../config/db";
import bcrypt from "bcryptjs";
const createUser = async (
  name: string,
  role: string,
  email: string,
  password: string,
  phone: number
) => {
  const hashedPass = await bcrypt.hash(password, 10);
  const result = await pool.query(
    "INSERT INTO users(name, role, email, password, phone) VALUES ($1, $2, $3, $4, $5) RETURNING *",
    [name, role, email, hashedPass, phone]
  );
  return result;
};

const getAllUsers = async () => {
  const result = await pool.query("SELECT * FROM users ORDER BY id ASC");
  return result;
};

const getSingleUser = async (id: string) => {
  const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
  return result;
};

const updateSingleUser = async (
  name: string,
  role: string,
  email: string,
  password: string,
  phone: number,
  id: string
) => {
  const result = await pool.query(
    `UPDATE users
       SET name = $1,
           role = $2,
           email = $3,
           password = $4,
           phone = $5
       WHERE id = $6
       RETURNING *`,
    [name, role, email, password, phone, id]
  );
  return result;
};

const deleteSingleUser = async (id: string) => {
  const result = await pool.query(
    "DELETE FROM users WHERE id = $1 RETURNING *",
    [id]
  );
  return result;
};

export const userService = {
  createUser,
  getAllUsers,
  getSingleUser,
  updateSingleUser,
  deleteSingleUser,
};
