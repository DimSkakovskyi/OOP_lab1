import { AppDataSource } from '../config/data-source';
import { Account } from '../entities/Account';
import { User } from '../entities/User';
import { ApiError } from '../utils/apiError';
import { hashPassword } from '../utils/password';

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

  static async createAdmin(login: string, password: string) {
    const userRepository = AppDataSource.getRepository(User);

    const existingUser = await userRepository.findOne({
      where: { login },
    });

    if (existingUser) {
      throw new ApiError(400, 'User already exists');
    }

    const hashedPassword = await hashPassword(password);

    const admin = userRepository.create({
      login,
      password: hashedPassword,
      role: 'ADMIN',
    });

    await userRepository.save(admin);

    return {
      id: admin.id,
      login: admin.login,
      role: admin.role,
    };
  }
}