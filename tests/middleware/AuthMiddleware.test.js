jest.mock('../../src/utils/cookies', () => ({
  parseCookies: jest.fn(),
}));

jest.mock('../../src/utils/sessionStore', () => ({
  getSession: jest.fn(),
}));

const AuthMiddleware = require('../../src/middleware/AuthMiddleware');
const { parseCookies } = require('../../src/utils/cookies');
const { getSession } = require('../../src/utils/sessionStore');

describe('AuthMiddleware', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('getCurrentUser should return null when there is no sessionId', () => {
    parseCookies.mockReturnValue({});

    const req = { headers: { cookie: '' } };

    const result = AuthMiddleware.getCurrentUser(req);

    expect(result).toBeNull();
  });

  test('getCurrentUser should return user from session', () => {
    parseCookies.mockReturnValue({ sessionId: 'abc123' });
    getSession.mockReturnValue({
      user: { id: 1, login: 'client1', role: 'CLIENT' },
    });

    const req = { headers: { cookie: 'sessionId=abc123' } };

    const result = AuthMiddleware.getCurrentUser(req);

    expect(result).toEqual({ id: 1, login: 'client1', role: 'CLIENT' });
  });

  test('requireAuth should redirect to /login if user is not authenticated', () => {
    parseCookies.mockReturnValue({});

    const req = { headers: { cookie: '' } };
    const res = {
      writeHead: jest.fn(),
      end: jest.fn(),
    };

    const result = AuthMiddleware.requireAuth(req, res);

    expect(result).toBeNull();
    expect(res.writeHead).toHaveBeenCalledWith(302, { Location: '/login' });
    expect(res.end).toHaveBeenCalled();
  });
});