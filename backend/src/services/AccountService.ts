import { prisma } from '../config/prisma';
import { ApiError } from '../utils/apiError';

export class AccountService {
  static async getUserAccounts(userId: number) {
    return prisma.account.findMany({
      where: { userId },
      orderBy: { id: 'asc' },
    });
  }

  static async getAccountDetails(userId: number, accountId: number) {
    const account = await prisma.account.findUnique({
      where: { id: accountId },
      include: {
        cards: true,
        payments: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!account) {
      throw new ApiError(404, 'Account not found');
    }

    if (account.userId !== userId) {
      throw new ApiError(403, 'Access denied');
    }

    return account;
  }

  static async blockAccount(userId: number, accountId: number) {
    const account = await prisma.account.findUnique({
      where: { id: accountId },
    });

    if (!account) {
      throw new ApiError(404, 'Account not found');
    }

    if (account.userId !== userId) {
      throw new ApiError(403, 'Access denied');
    }

    return prisma.account.update({
      where: { id: accountId },
      data: { isBlocked: true },
    });
  }
}