const AccountDAO = require('../dao/AccountDAO');
const PaymentDAO = require('../dao/PaymentDAO');

class PaymentService {
  static normalizeAmount(amount) {
    const parsedAmount = Number(amount);

    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      throw new Error('Amount must be greater than 0');
    }

    return parsedAmount;
  }

  static async createPayment(userId, accountId, amount, description = '') {
    const numericUserId = Number(userId);
    const numericAccountId = Number(accountId);
    const parsedAmount = this.normalizeAmount(amount);

    const account = await AccountDAO.findById(numericAccountId);

    if (!account) {
      throw new Error('Account not found');
    }

    if (Number(account.user_id) !== numericUserId) {
      throw new Error('Access denied');
    }

    if (account.is_blocked) {
      throw new Error('Account is blocked');
    }

    const currentBalance = Number(account.balance);

    if (currentBalance < parsedAmount) {
      throw new Error('Insufficient funds');
    }

    const newBalance = currentBalance - parsedAmount;

    const updatedAccount = await AccountDAO.updateBalance(
      numericAccountId,
      newBalance
    );

    const payment = await PaymentDAO.create(
      numericAccountId,
      parsedAmount,
      'PAYMENT',
      description || 'Payment'
    );

    return {
      updatedAccount,
      payment,
    };
  }

  static async createTopUp(userId, accountId, amount, description = '') {
    const numericUserId = Number(userId);
    const numericAccountId = Number(accountId);
    const parsedAmount = this.normalizeAmount(amount);

    const account = await AccountDAO.findById(numericAccountId);

    if (!account) {
      throw new Error('Account not found');
    }

    if (Number(account.user_id) !== numericUserId) {
      throw new Error('Access denied');
    }

    const currentBalance = Number(account.balance);
    const newBalance = currentBalance + parsedAmount;

    const updatedAccount = await AccountDAO.updateBalance(
      numericAccountId,
      newBalance
    );

    const payment = await PaymentDAO.create(
      numericAccountId,
      parsedAmount,
      'TOPUP',
      description || 'Top up'
    );

    return {
      updatedAccount,
      payment,
    };
  }

  static async getAccountPayments(userId, accountId) {
    const numericUserId = Number(userId);
    const numericAccountId = Number(accountId);

    const account = await AccountDAO.findById(numericAccountId);

    if (!account) {
      throw new Error('Account not found');
    }

    if (Number(account.user_id) !== numericUserId) {
      throw new Error('Access denied');
    }

    return PaymentDAO.findByAccountId(numericAccountId);
  }
}

module.exports = PaymentService;