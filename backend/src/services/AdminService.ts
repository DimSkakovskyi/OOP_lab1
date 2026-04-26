import { AppDataSource } from '../config/data-source';
import { Account } from '../entities/Account';
import { Card } from '../entities/Card';
import { ApiError } from '../utils/apiError';

export class AdminService {
  static async getAllAccounts(search?: string) {
    const accountRepository = AppDataSource.getRepository(Account);

    const query = accountRepository
      .createQueryBuilder('account')
      .leftJoinAndSelect('account.user', 'user')
      .orderBy('account.id', 'ASC');

    if (search) {
      query.andWhere('LOWER(user.login) LIKE LOWER(:search)', {
        search: `%${search}%`,
      });
    }

    const accounts = await query.getMany();

    return accounts.map((account) => ({
      id: account.id,
      accountNumber: account.accountNumber,
      balance: Number(account.balance),
      isBlocked: account.isBlocked,
      user: {
        id: account.user.id,
        login: account.user.login,
        role: account.user.role,
      },
    }));
  }

  static async getAccountDetails(accountId: number) {
    const accountRepository = AppDataSource.getRepository(Account);

    const account = await accountRepository.findOne({
      where: { id: accountId },
      relations: ['user', 'cards', 'payments'],
    });

    if (!account) {
      throw new ApiError(404, 'Account not found');
    }

    return {
      account: {
        id: account.id,
        accountNumber: account.accountNumber,
        balance: Number(account.balance),
        isBlocked: account.isBlocked,
        user: {
          id: account.user.id,
          login: account.user.login,
          role: account.user.role,
        },
      },
      cards: (account.cards ?? []).map((card) => ({
        id: card.id,
        cardNumber: card.cardNumber,
        expiryDate: card.expiryDate,
        accountId: card.accountId,
      })),
      payments: (account.payments ?? []).map((payment) => ({
        id: payment.id,
        amount: Number(payment.amount),
        type: payment.type,
        description: payment.description,
        createdAt: payment.createdAt,
      })),
    };
  }

  static async getCardDetails(accountId: number, cardId: number) {
    const accountRepository = AppDataSource.getRepository(Account);
    const cardRepository = AppDataSource.getRepository(Card);

    const account = await accountRepository.findOne({
      where: { id: accountId },
      relations: ['user'],
    });

    if (!account) {
      throw new ApiError(404, 'Account not found');
    }

    const card = await cardRepository.findOne({
      where: { id: cardId, accountId },
    });

    if (!card) {
      throw new ApiError(404, 'Card not found');
    }

    return {
      id: card.id,
      cardNumber: card.cardNumber,
      expiryDate: card.expiryDate,
      accountId: card.accountId,
      account: {
        id: account.id,
        accountNumber: account.accountNumber,
        balance: Number(account.balance),
        isBlocked: account.isBlocked,
        user: {
          id: account.user.id,
          login: account.user.login,
          role: account.user.role,
        },
      },
    };
  }

  static async blockAccount(accountId: number) {
    const accountRepository = AppDataSource.getRepository(Account);

    const account = await accountRepository.findOne({
      where: { id: accountId },
    });

    if (!account) {
      throw new ApiError(404, 'Account not found');
    }

    account.isBlocked = true;
    return accountRepository.save(account);
  }

  static async unblockAccount(accountId: number) {
    const accountRepository = AppDataSource.getRepository(Account);

    const account = await accountRepository.findOne({
      where: { id: accountId },
    });

    if (!account) {
      throw new ApiError(404, 'Account not found');
    }

    account.isBlocked = false;
    return accountRepository.save(account);
  }

  static async createAdmin(login: string, password: string) {
    throw new Error('Implement according to your current project version');
  }
}