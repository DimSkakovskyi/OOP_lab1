import { NextFunction, Request, Response } from 'express';
import { AdminService } from '../services/AdminService';

export class AdminController {
  static async getAllAccounts(req: Request, res: Response, next: NextFunction) {
    try {
      const search =
        typeof req.query.search === 'string' ? req.query.search : undefined;

      const result = await AdminService.getAllAccounts(search);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  static async getAccountDetails(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AdminService.getAccountDetails(Number(req.params.id));
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  static async getCardDetails(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AdminService.getCardDetails(
        Number(req.params.accountId),
        Number(req.params.cardId)
      );
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  static async blockAccount(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AdminService.blockAccount(Number(req.params.id));
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

  static async createAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const { login, password } = req.body;
      const result = await AdminService.createAdmin(login, password);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }
}