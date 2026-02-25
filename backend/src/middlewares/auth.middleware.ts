import { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../services/auth.service";

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Authorization header with Bearer token is required",
    });
  }

  const token = authHeader.slice("Bearer ".length).trim();

  try {
    req.authUser = verifyAccessToken(token);
    return next();
  } catch {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired access token",
    });
  }
};
