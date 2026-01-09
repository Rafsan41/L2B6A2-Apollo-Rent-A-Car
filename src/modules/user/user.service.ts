import { pool } from "../../config/db";
import bcrypt from "bcryptjs";
const createUser = async (payload: Record<string, unknown>) => {
  const { name, role, email, password, phone } = payload;
  const hashedPass = await bcrypt.hash(password as string, 10);
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
  phone: string,
  id: string
) => {
  const updates: string[] = [];
  const values: any[] = [];
  let index = 1;

  if (name) {
    updates.push(`name = $${index}`);
    values.push(name);
    index++;
  }
  if (role) {
    updates.push(`role = $${index}`);
    values.push(role);
    index++;
  }
  if (email) {
    updates.push(`email = $${index}`);
    values.push(email);
    index++;
  }
  if (password) {
    updates.push(`password = $${index}`);
    values.push(password);
    index++;
  }
  if (phone) {
    updates.push(`phone = $${index}`);
    values.push(phone);
    index++;
  }

  if (updates.length === 0) {
    throw new Error("No fields to update");
  }
  values.push(id);

  const query = `UPDATE users SET ${updates.join(
    ", "
  )} WHERE id = $${index} RETURNING id, name, email, password, phone, role`;

  const result = await pool.query(query, values);
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
