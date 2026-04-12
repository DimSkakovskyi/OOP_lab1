jest.mock('../../src/services/AccountService', () => ({
  getUserAccounts: jest.fn(),
  getAccountDetails: jest.fn(),
  blockAccount: jest.fn(),
}));

jest.mock('../../src/utils/bodyParser', () => ({
  parseBody: jest.fn(),
}));

jest.mock('../../src/middleware/AuthMiddleware', () => ({
  requireAuth: jest.fn(),
}));

jest.mock('../../src/controllers/helpers', () => ({
  renderView: jest.fn(),
  redirect: jest.fn(),
  sendError: jest.fn(),
}));

const AccountController = require('../../src/controllers/AccountController');
const AccountService = require('../../src/services/AccountService');
const { parseBody } = require('../../src/utils/bodyParser');
const AuthMiddleware = require('../../src/middleware/AuthMiddleware');
const { renderView, redirect, sendError } = require('../../src/controllers/helpers');

describe('AccountController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('listUserAccounts should render accounts page for authenticated user', async () => {
    const req = {};
    const res = {};
    const currentUser = { id: 3, login: 'client1', role: 'CLIENT' };
    const accounts = [
      { id: 1, account_number: 'ACC1001', balance: 1000, is_blocked: false },
      { id: 2, account_number: 'ACC1002', balance: 500, is_blocked: false },
    ];

    AuthMiddleware.requireAuth.mockReturnValue(currentUser);
    AccountService.getUserAccounts.mockResolvedValue(accounts);

    await AccountController.listUserAccounts(req, res);

    expect(AccountService.getUserAccounts).toHaveBeenCalledWith(3);
    expect(renderView).toHaveBeenCalledWith(res, 'accounts.ejs', {
      title: 'My Accounts',
      currentUser,
      accounts,
    });
  });

  test('listUserAccounts should stop if user is not authenticated', async () => {
    const req = {};
    const res = {};

    AuthMiddleware.requireAuth.mockReturnValue(null);

    await AccountController.listUserAccounts(req, res);

    expect(AccountService.getUserAccounts).not.toHaveBeenCalled();
    expect(renderView).not.toHaveBeenCalled();
  });

  test('showAccountDetails should render account details page', async () => {
    const req = {
      url: '/account?id=1',
    };
    const res = {};
    const currentUser = { id: 3, login: 'client1', role: 'CLIENT' };
    const details = {
      account: { id: 1, account_number: 'ACC1001', balance: 1000, is_blocked: false },
      cards: [{ id: 10, card_number: '4111111111111001', expiry_date: '12/27' }],
      payments: [{ id: 20, amount: 100, type: 'TOPUP', description: 'Initial top up' }],
    };

    AuthMiddleware.requireAuth.mockReturnValue(currentUser);
    AccountService.getAccountDetails.mockResolvedValue(details);

    await AccountController.showAccountDetails(req, res);

    expect(AccountService.getAccountDetails).toHaveBeenCalledWith(3, 1);
    expect(renderView).toHaveBeenCalledWith(res, 'account-details.ejs', {
      title: 'Account Details',
      currentUser,
      account: details.account,
      cards: details.cards,
      payments: details.payments,
    });
  });

  test('showAccountDetails should send error if account id is missing', async () => {
    const req = {
      url: '/account',
    };
    const res = {};
    const currentUser = { id: 3, login: 'client1', role: 'CLIENT' };

    AuthMiddleware.requireAuth.mockReturnValue(currentUser);

    await AccountController.showAccountDetails(req, res);

    expect(sendError).toHaveBeenCalledWith(res, 400, 'Account id is required');
  });

  test('showAccountDetails should send error when service throws', async () => {
    const req = {
      url: '/account?id=1',
    };
    const res = {};
    const currentUser = { id: 3, login: 'client1', role: 'CLIENT' };

    AuthMiddleware.requireAuth.mockReturnValue(currentUser);
    AccountService.getAccountDetails.mockRejectedValue(new Error('Access denied'));

    await AccountController.showAccountDetails(req, res);

    expect(sendError).toHaveBeenCalledWith(res, 400, 'Access denied');
  });

  test('blockAccount should block account and redirect', async () => {
    const req = {};
    const res = {};
    const currentUser = { id: 3, login: 'client1', role: 'CLIENT' };

    AuthMiddleware.requireAuth.mockReturnValue(currentUser);
    parseBody.mockResolvedValue({ accountId: '1' });
    AccountService.blockAccount.mockResolvedValue({
      id: 1,
      is_blocked: true,
    });

    await AccountController.blockAccount(req, res);

    expect(AccountService.blockAccount).toHaveBeenCalledWith(3, 1);
    expect(redirect).toHaveBeenCalledWith(res, '/account?id=1');
  });

  test('blockAccount should send error if account id is missing', async () => {
    const req = {};
    const res = {};
    const currentUser = { id: 3, login: 'client1', role: 'CLIENT' };

    AuthMiddleware.requireAuth.mockReturnValue(currentUser);
    parseBody.mockResolvedValue({});

    await AccountController.blockAccount(req, res);

    expect(sendError).toHaveBeenCalledWith(res, 400, 'Account id is required');
  });

  test('blockAccount should send error when service throws', async () => {
    const req = {};
    const res = {};
    const currentUser = { id: 3, login: 'client1', role: 'CLIENT' };

    AuthMiddleware.requireAuth.mockReturnValue(currentUser);
    parseBody.mockResolvedValue({ accountId: '1' });
    AccountService.blockAccount.mockRejectedValue(new Error('Access denied'));

    await AccountController.blockAccount(req, res);

    expect(sendError).toHaveBeenCalledWith(res, 400, 'Access denied');
  });
});