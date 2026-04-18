import { prisma } from '../config/prisma';
import { ApiError } from '../utils/apiError';

export class PaymentService {
  static async createPayment(
    userId: number,
    accountId: number,
    amount: number,
    description?: string
  ) {
    const account = await prisma.account.findUnique({
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

    return prisma.$transaction(async (tx) => {
      const updatedAccount = await tx.account.update({
        where: { id: accountId },
        data: {
          balance: {
            decrement: amount,
          },
        },
      });

      const payment = await tx.payment.create({
        data: {
          accountId,
          amount,
          type: 'PAYMENT',
          description,
        },
      });

      return { updatedAccount, payment };
    });
  }

  static async createTopUp(
    userId: number,
    accountId: number,
    amount: number,
    description?: string
  ) {
    const account = await prisma.account.findUnique({
      where: { id: accountId },
    });

    if (!account) {
      throw new ApiError(404, 'Account not found');
    }

    if (account.userId !== userId) {
      throw new ApiError(403, 'Access denied');
    }

    return prisma.$transaction(async (tx) => {
      const updatedAccount = await tx.account.update({
        where: { id: accountId },
        data: {
          balance: {
            increment: amount,
          },
        },
      });

      const payment = await tx.payment.create({
        data: {
          accountId,
          amount,
          type: 'TOPUP',
          description,
        },
      });

      return { updatedAccount, payment };
    });
  }
}