jest.mock('../../src/dao/UserDAO', () => ({
  findByLogin: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
}));

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}));

const AuthService = require('../../src/services/AuthService');
const UserDAO = require('../../src/dao/UserDAO');
const bcrypt = require('bcrypt');

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('login should return user data when credentials are valid', async () => {
    UserDAO.findByLogin.mockResolvedValue({
      id: 1,
      login: 'client1',
      password: 'hashed',
      role: 'CLIENT',
    });
    bcrypt.compare.mockResolvedValue(true);

    const result = await AuthService.login('client1', 'client123');

    expect(result).toEqual({
      id: 1,
      login: 'client1',
      role: 'CLIENT',
    });
  });

  test('login should throw when user does not exist', async () => {
    UserDAO.findByLogin.mockResolvedValue(null);

    await expect(AuthService.login('unknown', '123')).rejects.toThrow(
      'Invalid login or password'
    );
  });

  test('login should throw when password is invalid', async () => {
    UserDAO.findByLogin.mockResolvedValue({
      id: 1,
      login: 'client1',
      password: 'hashed',
      role: 'CLIENT',
    });
    bcrypt.compare.mockResolvedValue(false);

    await expect(AuthService.login('client1', 'wrong')).rejects.toThrow(
      'Invalid login or password'
    );
  });

  test('register should create user with hashed password', async () => {
    UserDAO.findByLogin.mockResolvedValue(null);
    bcrypt.hash.mockResolvedValue('hashed-password');
    UserDAO.create.mockResolvedValue({
      id: 3,
      login: 'client2',
      password: 'hashed-password',
      role: 'CLIENT',
    });

    const result = await AuthService.register('client2', 'client123', 'CLIENT');

    expect(bcrypt.hash).toHaveBeenCalledWith('client123', 10);
    expect(UserDAO.create).toHaveBeenCalledWith(
      'client2',
      'hashed-password',
      'CLIENT'
    );
    expect(result.id).toBe(3);
  });
});