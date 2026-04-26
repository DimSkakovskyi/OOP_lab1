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

  static async getAccountCards(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AccountService.getAccountCards(
        req.user!.id,
        Number(req.params.id)
      );
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
  
  static async getCardDetails(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AccountService.getCardDetails(
        req.user!.id,
        Number(req.params.accountId),
        Number(req.params.cardId)
      );
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  static async getCardTransferHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AccountService.getCardTransferHistory(
        req.user!.id,
        Number(req.params.accountId),
        Number(req.params.cardId)
      );
  
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}