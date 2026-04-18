import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/AuthService';

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { login, password } = req.body;
      const result = await AuthService.register(login, password);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { login, password } = req.body;
      const result = await AuthService.login(login, password);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}