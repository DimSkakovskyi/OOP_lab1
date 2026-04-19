import { AppDataSource } from '../config/data-source';
import { Account } from '../entities/Account';
import { ApiError } from '../utils/apiError';

export class AdminService {
  static async getAllAccounts() {
    const accountRepository = AppDataSource.getRepository(Account);

    return accountRepository.find({
      order: { id: 'ASC' },
    });
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
}