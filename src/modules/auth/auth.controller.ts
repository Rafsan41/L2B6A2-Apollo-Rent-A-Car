import { authServices } from "./auth.service";
import express, { Request, Response } from "express";

const logInUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const result = await authServices.logInUser(email, password);
    res.status(200).json({
      success: true,
      message: "user Successfully Login",
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const authController = {
  logInUser,
};
