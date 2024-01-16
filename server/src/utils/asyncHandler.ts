import { Request, Response, NextFunction } from "express";
import { ApiError } from "./ApiError";
export const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => any) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next);
    } catch (err) {
      if (err instanceof ApiError) {
        res.status(err.statusCode || 500).send({
          success: false,
          message: err.message,
        });
      }
    }
  };
