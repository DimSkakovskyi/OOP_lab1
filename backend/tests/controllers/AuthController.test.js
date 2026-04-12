jest.mock('../../src/services/AuthService', () => ({
  login: jest.fn(),
}));

jest.mock('../../src/utils/bodyParser', () => ({
  parseBody: jest.fn(),
}));

jest.mock('../../src/utils/sessionStore', () => ({
  createSession: jest.fn(),
  deleteSession: jest.fn(),
}));

jest.mock('../../src/utils/cookies', () => ({
  parseCookies: jest.fn(),
}));

jest.mock('../../src/middleware/AuthMiddleware', () => ({
  getCurrentUser: jest.fn(),
}));

jest.mock('../../src/controllers/helpers', () => ({
  renderView: jest.fn(),
  redirect: jest.fn(),
  sendError: jest.fn(),
}));

const AuthController = require('../../src/controllers/AuthController');
const AuthService = require('../../src/services/AuthService');
const { parseBody } = require('../../src/utils/bodyParser');
const { createSession } = require('../../src/utils/sessionStore');
const AuthMiddleware = require('../../src/middleware/AuthMiddleware');
const { renderView } = require('../../src/controllers/helpers');

describe('AuthController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('showLoginPage should render login page for guest', async () => {
    AuthMiddleware.getCurrentUser.mockReturnValue(null);

    await AuthController.showLoginPage({}, {});

    const res = {};
    await AuthController.showLoginPage({}, res);

    expect(renderView).toHaveBeenCalledWith(res, 'login.ejs', {
      title: 'Login',
      error: null,
    });
  });

  test('login should create session and redirect', async () => {
    parseBody.mockResolvedValue({
      login: 'client1',
      password: 'client123',
    });

    AuthService.login.mockResolvedValue({
      id: 3,
      login: 'client1',
      role: 'CLIENT',
    });

    createSession.mockReturnValue('session123');

    const res = {
      writeHead: jest.fn(),
      end: jest.fn(),
    };

    await AuthController.login({}, res);

    expect(res.writeHead).toHaveBeenCalledWith(302, {
      Location: '/accounts',
      'Set-Cookie': 'sessionId=session123; HttpOnly; Path=/',
    });
  });
});