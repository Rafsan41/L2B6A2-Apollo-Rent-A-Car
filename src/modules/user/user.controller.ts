import express, { Request, Response } from "express";

import { userService } from "./user.service";

const createUser = async (req: Request, res: Response) => {
  const { name, role, email, password, phone } = req.body;

  try {
    const result = await userService.createUser(
      name,
      role,
      email,
      password,
      phone
    );
    console.log(result);
    res.status(201).json({
      success: true,
      user: result.rows[0],
    });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const result = await userService.getAllUsers();
    res.status(200).json({
      success: true,
      users: result.rows,
    });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

const getSingleUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await userService.getSingleUser(id as string);
    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, user: result.rows[0] });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
};
const updateSingleUser = async (req: Request, res: Response) => {
  const { name, role, email, password, phone } = req.body;
  const { id } = req.params;

  try {
    const result = await userService.updateSingleUser(
      name,
      role,
      email,
      password,
      phone,
      id as string
    );

    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    } else {
      res.status(200).json({
        success: true,
        message: "user updated successfully",
        data: result.rows[0],
      });
    }
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
};
const deleteSingleUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await userService.deleteSingleUser(id as string);

    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    } else {
      res.status(200).json({
        success: true,
        message: "User deleted successfully",
        data: result.rows[0],
      });
    }
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
};
export const userController = {
  createUser,
  getAllUsers,
  getSingleUser,
  updateSingleUser,
  deleteSingleUser,
};
