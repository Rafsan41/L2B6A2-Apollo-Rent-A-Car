import { Request, Response, NextFunction } from "express";

//logger midleware
const logger = (req: Request, res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}]${req.method}${req.path}`);
  next();
};

export default logger;
