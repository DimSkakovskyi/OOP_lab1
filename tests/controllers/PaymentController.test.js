jest.mock('../../src/services/PaymentService', () => ({
  createPayment: jest.fn(),
  createTopUp: jest.fn(),
}));

jest.mock('../../src/utils/bodyParser', () => ({
  parseBody: jest.fn(),
}));

jest.mock('../../src/middleware/AuthMiddleware', () => ({
  requireAuth: jest.fn(),
}));

jest.mock('../../src/controllers/helpers', () => ({
  redirect: jest.fn(),
  sendError: jest.fn(),
}));

const PaymentController = require('../../src/controllers/PaymentController');
const PaymentService = require('../../src/services/PaymentService');
const { parseBody } = require('../../src/utils/bodyParser');
const AuthMiddleware = require('../../src/middleware/AuthMiddleware');
const { redirect, sendError } = require('../../src/controllers/helpers');

describe('PaymentController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('createPayment should call service and redirect', async () => {
    const req = {};
    const res = {};
    const currentUser = { id: 3, login: 'client1', role: 'CLIENT' };

    AuthMiddleware.requireAuth.mockReturnValue(currentUser);
    parseBody.mockResolvedValue({
      accountId: '1',
      amount: '200',
      description: 'Test payment',
    });

    PaymentService.createPayment.mockResolvedValue({
      updatedAccount: { id: 1, balance: 800 },
      payment: { id: 100, type: 'PAYMENT' },
    });

    await PaymentController.createPayment(req, res);

    expect(PaymentService.createPayment).toHaveBeenCalledWith(
      3,
      1,
      '200',
      'Test payment'
    );
    expect(redirect).toHaveBeenCalledWith(res, '/account?id=1');
  });

  test('createPayment should send error if account id is missing', async () => {
    const req = {};
    const res = {};
    const currentUser = { id: 3, login: 'client1', role: 'CLIENT' };

    AuthMiddleware.requireAuth.mockReturnValue(currentUser);
    parseBody.mockResolvedValue({
      amount: '200',
      description: 'Test payment',
    });

    await PaymentController.createPayment(req, res);

    expect(sendError).toHaveBeenCalledWith(res, 400, 'Account id is required');
  });

  test('createPayment should send error when service throws', async () => {
    const req = {};
    const res = {};
    const currentUser = { id: 3, login: 'client1', role: 'CLIENT' };

    AuthMiddleware.requireAuth.mockReturnValue(currentUser);
    parseBody.mockResolvedValue({
      accountId: '1',
      amount: '200',
      description: 'Test payment',
    });

    PaymentService.createPayment.mockRejectedValue(new Error('Insufficient funds'));

    await PaymentController.createPayment(req, res);

    expect(sendError).toHaveBeenCalledWith(res, 400, 'Insufficient funds');
  });

  test('createTopUp should call service and redirect', async () => {
    const req = {};
    const res = {};
    const currentUser = { id: 3, login: 'client1', role: 'CLIENT' };

    AuthMiddleware.requireAuth.mockReturnValue(currentUser);
    parseBody.mockResolvedValue({
      accountId: '1',
      amount: '300',
      description: 'Top up',
    });

    PaymentService.createTopUp.mockResolvedValue({
      updatedAccount: { id: 1, balance: 1300 },
      payment: { id: 101, type: 'TOPUP' },
    });

    await PaymentController.createTopUp(req, res);

    expect(PaymentService.createTopUp).toHaveBeenCalledWith(
      3,
      1,
      '300',
      'Top up'
    );
    expect(redirect).toHaveBeenCalledWith(res, '/account?id=1');
  });

  test('createTopUp should send error if account id is missing', async () => {
    const req = {};
    const res = {};
    const currentUser = { id: 3, login: 'client1', role: 'CLIENT' };

    AuthMiddleware.requireAuth.mockReturnValue(currentUser);
    parseBody.mockResolvedValue({
      amount: '300',
      description: 'Top up',
    });

    await PaymentController.createTopUp(req, res);

    expect(sendError).toHaveBeenCalledWith(res, 400, 'Account id is required');
  });

  test('createTopUp should send error when service throws', async () => {
    const req = {};
    const res = {};
    const currentUser = { id: 3, login: 'client1', role: 'CLIENT' };

    AuthMiddleware.requireAuth.mockReturnValue(currentUser);
    parseBody.mockResolvedValue({
      accountId: '1',
      amount: '300',
      description: 'Top up',
    });

    PaymentService.createTopUp.mockRejectedValue(new Error('Access denied'));

    await PaymentController.createTopUp(req, res);

    expect(sendError).toHaveBeenCalledWith(res, 400, 'Access denied');
  });
});