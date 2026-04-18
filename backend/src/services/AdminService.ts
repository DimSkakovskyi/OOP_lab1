import { prisma } from '../config/prisma';
import { ApiError } from '../utils/apiError';

export class AdminService {
  static async getAllAccounts() {
    return prisma.account.findMany({
      orderBy: { id: 'asc' },
    });
  }

  static async unblockAccount(accountId: number) {
    const account = await prisma.account.findUnique({
      where: { id: accountId },
    });

    if (!account) {
      throw new ApiError(404, 'Account not found');
    }

    return prisma.account.update({
      where: { id: accountId },
      data: { isBlocked: false },
    });
  }
}