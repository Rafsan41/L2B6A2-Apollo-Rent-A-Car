import express, { Request, Response } from "express";

import { userService } from "./user.service";

const createUser = async (req: Request, res: Response) => {
  try {
    const result = await userService.createUser(req.body);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        id: result.rows[0].id,
        name: result.rows[0].name,
        email: result.rows[0].email,
        phone: result.rows[0].phone,
        role: result.rows[0].role,
      },
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
      errors: err.message,
    });
  }
};

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const result = await userService.getAllUsers();
    res.status(200).json({
      success: true,
      message: "Users retrieved successfully", // REQUIRED
      data: result.rows.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      })),
    });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      errors: err.message,
    });
  }
};

const getSingleUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const loggedInUser = req.user;

    if (
      loggedInUser?.role === "customer" &&
      loggedInUser?.user_id !== parseInt(userId as string)
    ) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: You can only access your own data",
      });
    }
    const result = await userService.getSingleUser(userId as string);
    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "User retrieved successfully", // REQUIRED
      data: {
        // MUST be "data" not "user"
        id: result.rows[0].id,
        name: result.rows[0].name,
        email: result.rows[0].email,
        phone: result.rows[0].phone,
        role: result.rows[0].role,
      },
    });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      errors: err.message,
    });
  }
};
const updateSingleUser = async (req: Request, res: Response) => {
  const { name, role, email, password, phone } = req.body;
  const { userId } = req.params;

  try {
    const result = await userService.updateSingleUser(
      name,
      role,
      email,
      password,
      phone,
      userId as string
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "User updated successfully", // REQUIRED
        data: {
          // MUST be "data"
          id: result.rows[0].id,
          name: result.rows[0].name,
          email: result.rows[0].email,
          phone: result.rows[0].phone,
          role: result.rows[0].role,
        },
      });
    }
  } catch (err: any) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      errors: err.message,
    });
  }
};
const deleteSingleUser = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const result = await userService.deleteSingleUser(userId as string);

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "User deleted successfully",
      });
    }
  } catch (err: any) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      errors: err.message,
    });
  }
};
export const userController = {
  createUser,
  getAllUsers,
  getSingleUser,
  updateSingleUser,
  deleteSingleUser,
};
