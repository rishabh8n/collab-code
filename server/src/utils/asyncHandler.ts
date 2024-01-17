import { Request, Response, NextFunction } from "express";
import { ApiError } from "./ApiError";
import { CustomRequest } from "../middlewares/auth.middleware";
export const asyncHandler =
  (
    fn: (
      req: Request | CustomRequest,
      res: Response,
      next: NextFunction,
    ) => any,
  ) =>
  async (req: Request | CustomRequest, res: Response, next: NextFunction) => {
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
