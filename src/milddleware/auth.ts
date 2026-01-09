import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";

const auth = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;

      // 1 Check header exists
      if (!authHeader) {
        return res.status(401).json({
          success: false,
          message: "Authorization header missing",
        });
      }

      // 2 Extract token from "Bearer <token>"
      const token = authHeader.split(" ")[1];

      if (!token) {
        return res.status(401).json({
          success: false,
          message: "Token missing",
        });
      }

      // 3 Verify token
      const decoded = jwt.verify(
        token,
        config.jwtSecret as string
      ) as JwtPayload;

      // 4 Attach decoded user
      req.user = decoded;

      // 5 Role-based authorization
      if (roles.length && !roles.includes(decoded.role as string)) {
        return res.status(403).json({
          success: false,
          message: "Forbidden: insufficient permissions",
        });
      }

      next();
    } catch (error: any) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token !",
      });
    }
  };
};

export default auth;
