const AdminService = require('../services/AdminService');
const { parseBody } = require('../utils/bodyParser');
const RoleMiddleware = require('../middleware/RoleMiddleware');
const {
  renderView,
  redirect,
  sendError,
} = require('./helpers');

class AdminController {
  static async listAllAccounts(req, res) {
    try {
      const currentUser = RoleMiddleware.requireAdmin(req, res);

      if (!currentUser) {
        return;
      }

      const accounts = await AdminService.getAllAccounts(currentUser);
      const blockedAccounts = await AdminService.getBlockedAccounts(currentUser);

      return renderView(res, 'admin-accounts.ejs', {
        title: 'Admin Accounts',
        currentUser,
        accounts,
        blockedAccounts,
      });
    } catch (error) {
      return sendError(res, 500, error.message);
    }
  }

  static async unblockAccount(req, res) {
    try {
      const currentUser = RoleMiddleware.requireAdmin(req, res);

      if (!currentUser) {
        return;
      }

      const body = await parseBody(req);
      const accountId = Number(body.accountId);

      if (!accountId) {
        return sendError(res, 400, 'Account id is required');
      }

      await AdminService.unblockAccount(currentUser, accountId);

      return redirect(res, '/admin/accounts');
    } catch (error) {
      return sendError(res, 400, error.message);
    }
  }
}

module.exports = AdminController;