import config from "./config";
import initDB from "./config/db";
import { userRoutes } from "./modules/user/user.routes";
import { vechiclRoutes } from "./modules/vehicle/vehicle.routes";
import { bookinglRoutes } from "./modules/booking/booking.routes";
import express, { Request, Response } from "express";
import { authRoutes } from "./modules/auth/auth.routes";
const app = express();

app.use(express.json());
initDB();

//  initial get test
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is running 🚀",
  });
});
// initial post test
app.post("/", (req: Request, res: Response) => {
  res.status(201).json({
    success: true,
    message: "api is working",
  });
});

//auth
app.use("/api/v1/auth", authRoutes);
// _______________________________________________
//  users crud
app.use("/api/v1/users", userRoutes);
// ____________________________________________
//  vechicl crud
app.use("/api/v1/vehicles", vechiclRoutes);

// ____________________________________________
// booking crud
app.use("/api/v1/bookings", bookinglRoutes);

app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

export default app;
