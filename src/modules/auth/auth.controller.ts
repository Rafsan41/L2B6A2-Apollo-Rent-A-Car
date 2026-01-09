import { userService } from "../user/user.service";
import { authServices } from "./auth.service";
import express, { Request, Response } from "express";

const signUpUser = async (req: Request, res: Response) => {
  try {
    const result = await userService.createUser(req.body);
    res.status(201).json({
      success: true,
      message: "user registered Successfully ",
      data: result,
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

// ---------- sign in / login -----------

const signInUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const result = await authServices.signInUser(email, password);

  if (result === null) {
    return res.status(404).json({
      success: false,
      message: " user not found okkkkay !!!",
    });
  }

  if (result === false) {
    return res.status(401).json({
      success: false,
      message: "Invalid Credentials okkkkaay!!!",
    });
  }

  res.status(200).json({
    success: true,
    token: result.token,
    user: {
      id: result.user.id,
      name: result.user.name,
      email: result.user.email,
      role: result.user.role,
    },
  });
};

export const authController = {
  signUpUser,
  signInUser,
};
