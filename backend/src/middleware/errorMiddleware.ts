import { NextFunction, Request, Response } from 'express';
import { ApiError } from '../utils/apiError';

export function errorMiddleware(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  return res.status(500).json({ message: 'Internal server error' });
}