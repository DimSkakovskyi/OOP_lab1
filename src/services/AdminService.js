const AccountDAO = require('../dao/AccountDAO');

class AdminService {
  static ensureAdmin(currentUser) {
    if (!currentUser || currentUser.role !== 'ADMIN') {
      throw new Error('Access denied');
    }
  }

  static async getAllAccounts(currentUser) {
    this.ensureAdmin(currentUser);
    return AccountDAO.findAll();
  }

  static async getBlockedAccounts(currentUser) {
    this.ensureAdmin(currentUser);

    const accounts = await AccountDAO.findAll();
    return accounts.filter((account) => account.is_blocked);
  }

  static async unblockAccount(currentUser, accountId) {
    this.ensureAdmin(currentUser);

    const account = await AccountDAO.findById(accountId);

    if (!account) {
      throw new Error('Account not found');
    }

    if (!account.is_blocked) {
      return account;
    }

    return AccountDAO.unblock(accountId);
  }
}

module.exports = AdminService;