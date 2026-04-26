import { AppDataSource } from '../config/data-source';
import { Account } from '../entities/Account';
import { Card } from '../entities/Card';
import { Payment } from '../entities/Payment';
import { ApiError } from '../utils/apiError';

export class TransferService {
  static async createTransfer(
    userId: number,
    fromCardId: number,
    toCardNumber: string,
    amount: number,
    description?: string
  ) {
    if (amount <= 0) {
      throw new ApiError(400, 'Amount must be greater than 0');
    }

    return AppDataSource.transaction(async (manager) => {
      const cardRepository = manager.getRepository(Card);
      const accountRepository = manager.getRepository(Account);
      const paymentRepository = manager.getRepository(Payment);

      const fromCard = await cardRepository.findOne({
        where: { id: fromCardId },
      });

      if (!fromCard) {
        throw new ApiError(404, 'Source card not found');
      }

      const fromAccount = await accountRepository.findOne({
        where: { id: fromCard.accountId },
      });

      if (!fromAccount) {
        throw new ApiError(404, 'Source account not found');
      }

      if (fromAccount.userId !== userId) {
        throw new ApiError(403, 'Access denied');
      }

      if (fromAccount.isBlocked) {
        throw new ApiError(400, 'Source account is blocked');
      }

      const toCard = await cardRepository.findOne({
        where: { cardNumber: toCardNumber },
      });

      if (!toCard) {
        throw new ApiError(404, 'Destination card not found');
      }

      const toAccount = await accountRepository.findOne({
        where: { id: toCard.accountId },
      });

      if (!toAccount) {
        throw new ApiError(404, 'Destination account not found');
      }

      if (toAccount.isBlocked) {
        throw new ApiError(400, 'Destination account is blocked');
      }

      if (fromCard.id === toCard.id) {
        throw new ApiError(400, 'Cannot transfer to the same card');
      }

      if (Number(fromAccount.balance) < amount) {
        throw new ApiError(400, 'Insufficient funds');
      }

      fromAccount.balance = Number(fromAccount.balance) - amount;
      toAccount.balance = Number(toAccount.balance) + amount;

      const updatedFromAccount = await accountRepository.save(fromAccount);
      const updatedToAccount = await accountRepository.save(toAccount);

      const outgoingPayment = paymentRepository.create({
        accountId: fromAccount.id,
        amount,
        type: 'PAYMENT',
        description: description || `Transfer to ${toCard.cardNumber}`,
      });

      const incomingPayment = paymentRepository.create({
        accountId: toAccount.id,
        amount,
        type: 'TOPUP',
        description: description || `Transfer from ${fromCard.cardNumber}`,
      });

      await paymentRepository.save(outgoingPayment);
      await paymentRepository.save(incomingPayment);

      return {
        success: true,
        fromAccount: {
          id: updatedFromAccount.id,
          balance: Number(updatedFromAccount.balance),
        },
        toAccount: {
          id: updatedToAccount.id,
          balance: Number(updatedToAccount.balance),
        },
      };
    });
  }
}