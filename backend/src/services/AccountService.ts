import { AppDataSource } from '../config/data-source';
import { Account } from '../entities/Account';
import { ApiError } from '../utils/apiError';

export class AccountService {

  static async getUserAccounts(userId: number) {
    const accountRepository = AppDataSource.getRepository(Account);
  
    const accounts = await accountRepository.find({
      where: { userId },
      order: { id: 'ASC' },
    });
  
    return accounts.map((account) => ({
      id: account.id,
      accountNumber: account.accountNumber,
      balance: Number(account.balance),
      isBlocked: account.isBlocked,
    }));
  }
  
  static async getAccountDetails(userId: number, accountId: number) {
    const accountRepository = AppDataSource.getRepository(Account);

    const account = await accountRepository.findOne({
      where: { id: accountId },
      relations: ['cards', 'payments'],
    });

    if (!account) {
      throw new ApiError(404, 'Account not found');
    }

    if (account.userId !== userId) {
      throw new ApiError(403, 'Access denied');
    }

    return {
      account: {
        id: account.id,
        accountNumber: account.accountNumber,
        balance: Number(account.balance),
        isBlocked: account.isBlocked,
      },
      cards: account.cards ?? [],
      payments: (account.payments ?? []).map((payment) => ({
        id: payment.id,
        amount: Number(payment.amount),
        type: payment.type,
        description: payment.description,
        createdAt: payment.createdAt,
      })),
    };
  }

  static async blockAccount(userId: number, accountId: number) {
    const accountRepository = AppDataSource.getRepository(Account);

    const account = await accountRepository.findOne({
      where: { id: accountId },
    });

    if (!account) {
      throw new ApiError(404, 'Account not found');
    }

    if (account.userId !== userId) {
      throw new ApiError(403, 'Access denied');
    }

    account.isBlocked = true;
    return accountRepository.save(account);
  }
}