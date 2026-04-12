jest.mock('../../src/dao/AccountDAO', () => ({
  findAll: jest.fn(),
  findById: jest.fn(),
  unblock: jest.fn(),
}));

const AdminService = require('../../src/services/AdminService');
const AccountDAO = require('../../src/dao/AccountDAO');

describe('AdminService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('getAllAccounts should return accounts for admin', async () => {
    AccountDAO.findAll.mockResolvedValue([{ id: 1 }, { id: 2 }]);

    const result = await AdminService.getAllAccounts({ id: 1, role: 'ADMIN' });

    expect(result).toHaveLength(2);
  });

  test('getAllAccounts should throw for non-admin', async () => {
    await expect(
      AdminService.getAllAccounts({ id: 2, role: 'CLIENT' })
    ).rejects.toThrow('Access denied');
  });

  test('unblockAccount should unblock blocked account', async () => {
    AccountDAO.findById.mockResolvedValue({
      id: 1,
      is_blocked: true,
    });

    AccountDAO.unblock.mockResolvedValue({
      id: 1,
      is_blocked: false,
    });

    const result = await AdminService.unblockAccount(
      { id: 1, role: 'ADMIN' },
      1
    );

    expect(AccountDAO.unblock).toHaveBeenCalledWith(1);
    expect(result.is_blocked).toBe(false);
  });
});