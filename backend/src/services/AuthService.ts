import { AppDataSource } from '../config/data-source';
import { User } from '../entities/User';
import { Account } from '../entities/Account';
import { ApiError } from '../utils/apiError';
import { comparePassword, hashPassword } from '../utils/password';
import { generateToken } from '../utils/jwt';
import { generateAccountNumber } from '../utils/accountNumber';

export class AuthService {
  static async register(login: string, password: string) {
    return AppDataSource.transaction(async (manager) => {
      const userRepository = manager.getRepository(User);
      const accountRepository = manager.getRepository(Account);

      const existingUser = await userRepository.findOne({
        where: { login },
      });

      if (existingUser) {
        throw new ApiError(400, 'User already exists');
      }

      const hashedPassword = await hashPassword(password);

      const user = userRepository.create({
        login,
        password: hashedPassword,
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

      const token = generateToken({
        id: user.id,
        login: user.login,
        role: user.role,
      });

      return {
        token,
        user: {
          id: user.id,
          login: user.login,
          role: user.role,
        },
      };
    });
  }

  static async login(login: string, password: string) {
    const userRepository = AppDataSource.getRepository(User);

    const user = await userRepository.findOne({
      where: { login },
    });

    if (!user) {
      throw new ApiError(400, 'Invalid credentials');
    }

    const isValid = await comparePassword(password, user.password);

    if (!isValid) {
      throw new ApiError(400, 'Invalid credentials');
    }

    const token = generateToken({
      id: user.id,
      login: user.login,
      role: user.role,
    });

    return {
      token,
      user: {
        id: user.id,
        login: user.login,
        role: user.role,
      },
    };
  }
}