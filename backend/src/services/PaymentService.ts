import { AppDataSource } from '../config/data-source';
import { Account } from '../entities/Account';
import { Payment } from '../entities/Payment';
import { ApiError } from '../utils/apiError';

export class PaymentService {
  static async createPayment(
    userId: number,
    accountId: number,
    amount: number,
    description?: string
  ) {
    if (amount <= 0) {
      throw new ApiError(400, 'Amount must be greater than 0');
    }

    return AppDataSource.transaction(async (manager) => {
      const accountRepository = manager.getRepository(Account);
      const paymentRepository = manager.getRepository(Payment);

      const account = await accountRepository.findOne({
        where: { id: accountId },
      });

      if (!account) {
        throw new ApiError(404, 'Account not found');
      }

      if (account.userId !== userId) {
        throw new ApiError(403, 'Access denied');
      }

      if (account.isBlocked) {
        throw new ApiError(400, 'Account is blocked');
      }

      if (Number(account.balance) < amount) {
        throw new ApiError(400, 'Insufficient funds');
      }

      account.balance = Number(account.balance) - amount;
      const updatedAccount = await accountRepository.save(account);

      const payment = paymentRepository.create({
        accountId,
        amount,
        type: 'PAYMENT',
        description: description || null,
      });

      await paymentRepository.save(payment);

      return { updatedAccount, payment };
    });
  }

  static async createTopUp(
    userId: number,
    accountId: number,
    amount: number,
    description?: string
  ) {
    if (amount <= 0) {
      throw new ApiError(400, 'Amount must be greater than 0');
    }

    return AppDataSource.transaction(async (manager) => {
      const accountRepository = manager.getRepository(Account);
      const paymentRepository = manager.getRepository(Payment);

      const account = await accountRepository.findOne({
        where: { id: accountId },
      });

      if (!account) {
        throw new ApiError(404, 'Account not found');
      }

      if (account.userId !== userId) {
        throw new ApiError(403, 'Access denied');
      }

      account.balance = Number(account.balance) + amount;
      const updatedAccount = await accountRepository.save(account);

      const payment = paymentRepository.create({
        accountId,
        amount,
        type: 'TOPUP',
        description: description || null,
      });

      await paymentRepository.save(payment);

      return { updatedAccount, payment };
    });
  }
}