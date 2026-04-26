import { AppDataSource } from '../config/data-source';
import { Account } from '../entities/Account';
import { Card } from '../entities/Card';
import { ApiError } from '../utils/apiError';

import { User } from '../entities/User';
import { hashPassword, hashPasswordLikeFrontend, generateAccountNumber, generateCardNumber } from '../utils/password';
import crypto from 'crypto';

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

  static async createClient(login: string, password: string) {
    return AppDataSource.transaction(async (manager) => {
      const userRepository = manager.getRepository(User);
      const accountRepository = manager.getRepository(Account);
  
      const existingUser = await userRepository.findOne({
        where: { login },
      });
  
      if (existingUser) {
        throw new ApiError(400, 'User already exists');
      }
  
      const frontendHashedPassword = hashPasswordLikeFrontend(password);
      const backendHashedPassword = await hashPassword(frontendHashedPassword);
  
      const user = userRepository.create({
        login,
        password: backendHashedPassword,
        role: 'CLIENT',
      });
  
      await userRepository.save(user);
  
      const account = accountRepository.create({
        userId: user.id,
        accountNumber: generateAccountNumber(),
        balance: 0,
        isBlocked: false,
      });
  
      await accountRepository.save(account);
  
      return {
        id: user.id,
        login: user.login,
        role: user.role,
        account: {
          id: account.id,
          accountNumber: account.accountNumber,
        },
      };
    });
  }
  
  static async createAdmin(login: string, password: string) {
    const userRepository = AppDataSource.getRepository(User);
  
    const existingUser = await userRepository.findOne({
      where: { login },
    });
  
    if (existingUser) {
      throw new ApiError(400, 'User already exists');
    }
  
    const frontendHashedPassword = hashPasswordLikeFrontend(password);
    const backendHashedPassword = await hashPassword(frontendHashedPassword);
  
    const admin = userRepository.create({
      login,
      password: backendHashedPassword,
      role: 'ADMIN',
    });
  
    await userRepository.save(admin);
  
    return {
      id: admin.id,
      login: admin.login,
      role: admin.role,
    };
  }
  
  static async addCardToAccount(accountId: number, expiryDate: string) {
    const accountRepository = AppDataSource.getRepository(Account);
    const cardRepository = AppDataSource.getRepository(Card);
  
    const account = await accountRepository.findOne({
      where: { id: accountId },
    });
  
    if (!account) {
      throw new ApiError(404, 'Account not found');
    }
  
    const card = cardRepository.create({
      accountId: account.id,
      cardNumber: generateCardNumber(),
      expiryDate,
    });
  
    await cardRepository.save(card);
  
    return {
      id: card.id,
      cardNumber: card.cardNumber,
      expiryDate: card.expiryDate,
      accountId: card.accountId,
    };
  }
}