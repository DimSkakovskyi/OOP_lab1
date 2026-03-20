const AccountService = require('../services/AccountService');
const { parseBody } = require('../utils/bodyParser');
const {
  renderView,
  redirect,
  sendError,
  requireAuth,
} = require('./helpers');

class AccountController {
  static async listUserAccounts(req, res) {
    try {
      const currentUser = requireAuth(req, res);

      if (!currentUser) {
        return;
      }

      const accounts = await AccountService.getUserAccounts(currentUser.id);

      return renderView(res, 'accounts.ejs', {
        title: 'My Accounts',
        currentUser,
        accounts,
      });
    } catch (error) {
      return sendError(res, 500, error.message);
    }
  }

  static async showAccountDetails(req, res) {
    try {
      const currentUser = requireAuth(req, res);

      if (!currentUser) {
        return;
      }

      const url = new URL(req.url, 'http://localhost:3000');
      const accountId = Number(url.searchParams.get('id'));

      if (!accountId) {
        return sendError(res, 400, 'Account id is required');
      }

      const details = await AccountService.getAccountDetails(
        currentUser.id,
        accountId
      );

      return renderView(res, 'account-details.ejs', {
        title: 'Account Details',
        currentUser,
        account: details.account,
        cards: details.cards,
        payments: details.payments,
      });
    } catch (error) {
      return sendError(res, 400, error.message);
    }
  }

  static async blockAccount(req, res) {
    try {
      const currentUser = requireAuth(req, res);

      if (!currentUser) {
        return;
      }

      const body = await parseBody(req);
      const accountId = Number(body.accountId);

      if (!accountId) {
        return sendError(res, 400, 'Account id is required');
      }

      await AccountService.blockAccount(currentUser.id, accountId);

      return redirect(res, `/account?id=${accountId}`);
    } catch (error) {
      return sendError(res, 400, error.message);
    }
  }
}

module.exports = AccountController;