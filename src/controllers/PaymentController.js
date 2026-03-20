const PaymentService = require('../services/PaymentService');
const { parseBody } = require('../utils/bodyParser');
const {
  redirect,
  sendError,
  requireAuth,
} = require('./helpers');

class PaymentController {
  static async createPayment(req, res) {
    try {
      const currentUser = requireAuth(req, res);

      if (!currentUser) {
        return;
      }

      const body = await parseBody(req);
      const accountId = Number(body.accountId);
      const amount = body.amount;
      const description = (body.description || '').trim();

      if (!accountId) {
        return sendError(res, 400, 'Account id is required');
      }

      await PaymentService.createPayment(
        currentUser.id,
        accountId,
        amount,
        description
      );

      return redirect(res, `/account?id=${accountId}`);
    } catch (error) {
      return sendError(res, 400, error.message);
    }
  }

  static async createTopUp(req, res) {
    try {
      const currentUser = requireAuth(req, res);

      if (!currentUser) {
        return;
      }

      const body = await parseBody(req);
      const accountId = Number(body.accountId);
      const amount = body.amount;
      const description = (body.description || '').trim();

      if (!accountId) {
        return sendError(res, 400, 'Account id is required');
      }

      await PaymentService.createTopUp(
        currentUser.id,
        accountId,
        amount,
        description
      );

      return redirect(res, `/account?id=${accountId}`);
    } catch (error) {
      return sendError(res, 400, error.message);
    }
  }
}

module.exports = PaymentController;