import { prisma } from '../config/prisma';
import { ApiError } from '../utils/apiError';
import { comparePassword, hashPassword } from '../utils/password';
import { generateToken } from '../utils/jwt';

export class AuthService {
  static async register(login: string, password: string) {
    const existingUser = await prisma.user.findUnique({
      where: { login },
    });

    if (existingUser) {
      throw new ApiError(400, 'User already exists');
    }

    const hashed = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        login,
        password: hashed,
        role: 'CLIENT',
      },
    });

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

  static async login(login: string, password: string) {
    const user = await prisma.user.findUnique({
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