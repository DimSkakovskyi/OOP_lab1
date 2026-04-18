import { Request, Response, NextFunction } from 'express';
import { AccountService } from '../services/AccountService';

export class AccountController {
  static async getAccounts(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AccountService.getUserAccounts(req.user!.id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  static async getAccountDetails(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AccountService.getAccountDetails(
        req.user!.id,
        Number(req.params.id)
      );
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  static async blockAccount(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AccountService.blockAccount(
        req.user!.id,
        Number(req.params.id)
      );
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}