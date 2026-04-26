import { NextFunction, Request, Response } from 'express';
import { TransferService } from '../services/TransferService';

export class TransferController {
  static async createTransfer(req: Request, res: Response, next: NextFunction) {
    try {
      const { fromCardId, toCardNumber, amount, description } = req.body;

      const result = await TransferService.createTransfer(
        req.user!.id,
        Number(fromCardId),
        toCardNumber,
        Number(amount),
        description
      );

      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }
}