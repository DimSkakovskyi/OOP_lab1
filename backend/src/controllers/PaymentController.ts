import { Request, Response, NextFunction } from 'express';
import { PaymentService } from '../services/PaymentService';

export class PaymentController {
  static async createPayment(req: Request, res: Response, next: NextFunction) {
    try {
      const { accountId, amount, description } = req.body;
      const result = await PaymentService.createPayment(
        req.user!.id,
        Number(accountId),
        Number(amount),
        description
      );
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async createTopUp(req: Request, res: Response, next: NextFunction) {
    try {
      const { accountId, amount, description } = req.body;
      const result = await PaymentService.createTopUp(
        req.user!.id,
        Number(accountId),
        Number(amount),
        description
      );
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }
}