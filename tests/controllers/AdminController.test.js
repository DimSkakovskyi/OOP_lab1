jest.mock('../../src/services/AdminService', () => ({
  getAllAccounts: jest.fn(),
  getBlockedAccounts: jest.fn(),
  unblockAccount: jest.fn(),
}));

jest.mock('../../src/utils/bodyParser', () => ({
  parseBody: jest.fn(),
}));

jest.mock('../../src/middleware/RoleMiddleware', () => ({
  requireAdmin: jest.fn(),
}));

jest.mock('../../src/controllers/helpers', () => ({
  renderView: jest.fn(),
  redirect: jest.fn(),
  sendError: jest.fn(),
}));

const AdminController = require('../../src/controllers/AdminController');
const AdminService = require('../../src/services/AdminService');
const { parseBody } = require('../../src/utils/bodyParser');
const RoleMiddleware = require('../../src/middleware/RoleMiddleware');
const { renderView, redirect, sendError } = require('../../src/controllers/helpers');

describe('AdminController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('listAllAccounts should render admin accounts page', async () => {
    const req = {};
    const res = {};
    const currentUser = { id: 1, login: 'admin1', role: 'ADMIN' };
    const accounts = [
      { id: 1, account_number: 'ACC1001', is_blocked: false },
      { id: 2, account_number: 'ACC1002', is_blocked: true },
    ];
    const blockedAccounts = [
      { id: 2, account_number: 'ACC1002', is_blocked: true },
    ];

    RoleMiddleware.requireAdmin.mockReturnValue(currentUser);
    AdminService.getAllAccounts.mockResolvedValue(accounts);
    AdminService.getBlockedAccounts.mockResolvedValue(blockedAccounts);

    await AdminController.listAllAccounts(req, res);

    expect(AdminService.getAllAccounts).toHaveBeenCalledWith(currentUser);
    expect(AdminService.getBlockedAccounts).toHaveBeenCalledWith(currentUser);
    expect(renderView).toHaveBeenCalledWith(res, 'admin-accounts.ejs', {
      title: 'Admin Accounts',
      currentUser,
      accounts,
      blockedAccounts,
    });
  });

  test('listAllAccounts should stop if current user is not admin', async () => {
    const req = {};
    const res = {};

    RoleMiddleware.requireAdmin.mockReturnValue(null);

    await AdminController.listAllAccounts(req, res);

    expect(AdminService.getAllAccounts).not.toHaveBeenCalled();
    expect(renderView).not.toHaveBeenCalled();
  });

  test('listAllAccounts should send error when service throws', async () => {
    const req = {};
    const res = {};
    const currentUser = { id: 1, login: 'admin1', role: 'ADMIN' };

    RoleMiddleware.requireAdmin.mockReturnValue(currentUser);
    AdminService.getAllAccounts.mockRejectedValue(new Error('Database error'));

    await AdminController.listAllAccounts(req, res);

    expect(sendError).toHaveBeenCalledWith(res, 500, 'Database error');
  });

  test('unblockAccount should call service and redirect', async () => {
    const req = {};
    const res = {};
    const currentUser = { id: 1, login: 'admin1', role: 'ADMIN' };

    RoleMiddleware.requireAdmin.mockReturnValue(currentUser);
    parseBody.mockResolvedValue({ accountId: '2' });
    AdminService.unblockAccount.mockResolvedValue({
      id: 2,
      is_blocked: false,
    });

    await AdminController.unblockAccount(req, res);

    expect(AdminService.unblockAccount).toHaveBeenCalledWith(currentUser, 2);
    expect(redirect).toHaveBeenCalledWith(res, '/admin/accounts');
  });

  test('unblockAccount should send error if account id is missing', async () => {
    const req = {};
    const res = {};
    const currentUser = { id: 1, login: 'admin1', role: 'ADMIN' };

    RoleMiddleware.requireAdmin.mockReturnValue(currentUser);
    parseBody.mockResolvedValue({});

    await AdminController.unblockAccount(req, res);

    expect(sendError).toHaveBeenCalledWith(res, 400, 'Account id is required');
  });

  test('unblockAccount should send error when service throws', async () => {
    const req = {};
    const res = {};
    const currentUser = { id: 1, login: 'admin1', role: 'ADMIN' };

    RoleMiddleware.requireAdmin.mockReturnValue(currentUser);
    parseBody.mockResolvedValue({ accountId: '2' });
    AdminService.unblockAccount.mockRejectedValue(new Error('Account not found'));

    await AdminController.unblockAccount(req, res);

    expect(sendError).toHaveBeenCalledWith(res, 400, 'Account not found');
  });
});