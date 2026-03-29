jest.mock('../../src/dao/AccountDAO', () => ({
  findByUserId: jest.fn(),
  findById: jest.fn(),
  block: jest.fn(),
}));

jest.mock('../../src/dao/CardDAO', () => ({
  findByAccountId: jest.fn(),
}));

jest.mock('../../src/dao/PaymentDAO', () => ({
  findByAccountId: jest.fn(),
}));

const AccountService = require('../../src/services/AccountService');
const AccountDAO = require('../../src/dao/AccountDAO');
const CardDAO = require('../../src/dao/CardDAO');
const PaymentDAO = require('../../src/dao/PaymentDAO');

describe('AccountService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('getUserAccounts should return accounts of user', async () => {
    AccountDAO.findByUserId.mockResolvedValue([{ id: 1 }, { id: 2 }]);

    const result = await AccountService.getUserAccounts(3);

    expect(AccountDAO.findByUserId).toHaveBeenCalledWith(3);
    expect(result).toHaveLength(2);
  });

  test('getAccountDetails should return account, cards and payments', async () => {
    AccountDAO.findById.mockResolvedValue({ id: 1, user_id: 3 });
    CardDAO.findByAccountId.mockResolvedValue([{ id: 11 }]);
    PaymentDAO.findByAccountId.mockResolvedValue([{ id: 21 }]);

    const result = await AccountService.getAccountDetails(3, 1);

    expect(result.account.id).toBe(1);
    expect(result.cards).toHaveLength(1);
    expect(result.payments).toHaveLength(1);
  });

  test('getAccountDetails should throw for чужий рахунок', async () => {
    AccountDAO.findById.mockResolvedValue({ id: 1, user_id: 999 });

    await expect(AccountService.getAccountDetails(3, 1)).rejects.toThrow(
      'Access denied'
    );
  });

  test('blockAccount should block own account', async () => {
    AccountDAO.findById.mockResolvedValue({
      id: 1,
      user_id: 3,
      is_blocked: false,
    });
    AccountDAO.block.mockResolvedValue({
      id: 1,
      user_id: 3,
      is_blocked: true,
    });

    const result = await AccountService.blockAccount(3, 1);

    expect(AccountDAO.block).toHaveBeenCalledWith(1);
    expect(result.is_blocked).toBe(true);
  });
});