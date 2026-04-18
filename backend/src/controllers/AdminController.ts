import { Request, Response, NextFunction } from 'express';
import { AdminService } from '../services/AdminService';

export class AdminController {
  static async getAllAccounts(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AdminService.getAllAccounts();
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  static async unblockAccount(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AdminService.unblockAccount(Number(req.params.id));
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}