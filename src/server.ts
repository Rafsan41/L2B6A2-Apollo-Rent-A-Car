import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { Pool } from "pg";
import path from "path";
const app = express();
const port = 5000;

dotenv.config({ path: path.join(process.cwd(), ".env") });
app.use(express.json());

const pool = new Pool({
  connectionString: `${process.env.CONNECTION_STR}`,
});

const initDB = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'customer')),
      email VARCHAR(200) UNIQUE NOT NULL,
      password VARCHAR(300) NOT NULL,
      phone VARCHAR(20) NOT NULL,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS vehicles (
      id SERIAL PRIMARY KEY,
      vehicle_name VARCHAR(150) NOT NULL,
      type VARCHAR(50) NOT NULL CHECK (type IN ('car', 'bike', 'van', 'SUV')),
      registration_number VARCHAR(100) UNIQUE NOT NULL,
      daily_rent_price NUMERIC(10, 2) NOT NULL CHECK (daily_rent_price > 0),
      availability_status VARCHAR(50) NOT NULL CHECK (availability_status IN ('available', 'booked')),
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS bookings (
      id SERIAL PRIMARY KEY,
      customer_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      vehicle_id INT NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
      rent_start_date DATE NOT NULL,
      rent_end_date DATE NOT NULL CHECK (rent_end_date > rent_start_date),
      total_price NUMERIC(10, 2) NOT NULL CHECK (total_price > 0),
      status VARCHAR(50) NOT NULL CHECK (status IN ('active', 'cancelled', 'returned')),
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );
  `);
};

initDB();

app.get("/", (req: Request, res: Response) => {
  res.send("Hello Apollo rent a car !!! ");
});

app.post("/", (req: Request, res: Response) => {
  console.log(req);
  res.status(201).json({
    success: true,
    message: "api is working",
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
