jest.mock('../../src/middleware/AuthMiddleware', () => ({
  requireAuth: jest.fn(),
}));

const RoleMiddleware = require('../../src/middleware/RoleMiddleware');
const AuthMiddleware = require('../../src/middleware/AuthMiddleware');

describe('RoleMiddleware', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should allow admin', () => {
    AuthMiddleware.requireAuth.mockReturnValue({
      id: 1,
      role: 'ADMIN',
    });

    const req = {};
    const res = {
      writeHead: jest.fn(),
      end: jest.fn(),
    };

    const result = RoleMiddleware.requireAdmin(req, res);

    expect(result).toEqual({ id: 1, role: 'ADMIN' });
  });

  test('should deny non-admin', () => {
    AuthMiddleware.requireAuth.mockReturnValue({
      id: 2,
      role: 'CLIENT',
    });

    const req = {};
    const res = {
      writeHead: jest.fn(),
      end: jest.fn(),
    };

    const result = RoleMiddleware.requireAdmin(req, res);

    expect(result).toBeNull();
    expect(res.writeHead).toHaveBeenCalledWith(403, {
      'Content-Type': 'text/plain; charset=utf-8',
    });
    expect(res.end).toHaveBeenCalledWith('Access denied');
  });
});