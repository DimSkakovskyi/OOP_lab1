jest.mock('../../src/dao/AccountDAO', () => ({
  findById: jest.fn(),
  updateBalance: jest.fn(),
}));

jest.mock('../../src/dao/PaymentDAO', () => ({
  create: jest.fn(),
  findByAccountId: jest.fn(),
}));

const PaymentService = require('../../src/services/PaymentService');
const AccountDAO = require('../../src/dao/AccountDAO');
const PaymentDAO = require('../../src/dao/PaymentDAO');

describe('PaymentService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('createPayment should subtract balance and create payment', async () => {
    AccountDAO.findById.mockResolvedValue({
      id: 1,
      user_id: 3,
      balance: 1000,
      is_blocked: false,
    });

    AccountDAO.updateBalance.mockResolvedValue({
      id: 1,
      balance: 800,
    });

    PaymentDAO.create.mockResolvedValue({
      id: 10,
      account_id: 1,
      amount: 200,
      type: 'PAYMENT',
    });

    const result = await PaymentService.createPayment(3, 1, 200, 'Test');

    expect(AccountDAO.updateBalance).toHaveBeenCalledWith(1, 800);
    expect(PaymentDAO.create).toHaveBeenCalledWith(1, 200, 'PAYMENT', 'Test');
    expect(result.updatedAccount.balance).toBe(800);
  });

  test('createPayment should throw when account is blocked', async () => {
    AccountDAO.findById.mockResolvedValue({
      id: 1,
      user_id: 3,
      balance: 1000,
      is_blocked: true,
    });

    await expect(PaymentService.createPayment(3, 1, 100, 'Test')).rejects.toThrow(
      'Account is blocked'
    );
  });

  test('createPayment should throw when balance is not enough', async () => {
    AccountDAO.findById.mockResolvedValue({
      id: 1,
      user_id: 3,
      balance: 50,
      is_blocked: false,
    });

    await expect(PaymentService.createPayment(3, 1, 100, 'Test')).rejects.toThrow(
      'Insufficient funds'
    );
  });

  test('createTopUp should increase balance and create TOPUP record', async () => {
    AccountDAO.findById.mockResolvedValue({
      id: 1,
      user_id: 3,
      balance: 100,
      is_blocked: false,
    });

    AccountDAO.updateBalance.mockResolvedValue({
      id: 1,
      balance: 300,
    });

    PaymentDAO.create.mockResolvedValue({
      id: 11,
      account_id: 1,
      amount: 200,
      type: 'TOPUP',
    });

    const result = await PaymentService.createTopUp(3, 1, 200, 'Top up');

    expect(AccountDAO.updateBalance).toHaveBeenCalledWith(1, 300);
    expect(PaymentDAO.create).toHaveBeenCalledWith(1, 200, 'TOPUP', 'Top up');
    expect(result.updatedAccount.balance).toBe(300);
  });
});