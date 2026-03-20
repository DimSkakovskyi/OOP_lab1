const AccountDAO = require('../dao/AccountDAO');
const CardDAO = require('../dao/CardDAO');
const PaymentDAO = require('../dao/PaymentDAO');

class AccountService {
  static async getUserAccounts(userId) {
    return AccountDAO.findByUserId(userId);
  }

  static async getAccountDetails(userId, accountId) {
    const account = await AccountDAO.findById(accountId);

    if (!account) {
      throw new Error('Account not found');
    }

    if (account.user_id !== userId) {
      throw new Error('Access denied');
    }

    const cards = await CardDAO.findByAccountId(accountId);
    const payments = await PaymentDAO.findByAccountId(accountId);

    return {
      account,
      cards,
      payments,
    };
  }

  static async blockAccount(userId, accountId) {
    const account = await AccountDAO.findById(accountId);

    if (!account) {
      throw new Error('Account not found');
    }

    if (account.user_id !== userId) {
      throw new Error('Access denied');
    }

    if (account.is_blocked) {
      return account;
    }

    return AccountDAO.block(accountId);
  }

  static async getOwnAccount(userId, accountId) {
    const account = await AccountDAO.findById(accountId);

    if (!account) {
      throw new Error('Account not found');
    }

    if (account.user_id !== userId) {
      throw new Error('Access denied');
    }

    return account;
  }
}

module.exports = AccountService;