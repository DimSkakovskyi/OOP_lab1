const Router = require('../../src/routing/Router');

describe('Router', () => {
  test('should call matching route handler', () => {
    const router = new Router();
    const handler = jest.fn();

    router.register('GET', '/login', handler);

    const req = {
      method: 'GET',
      url: '/login',
    };

    const res = {
      writeHead: jest.fn(),
      end: jest.fn(),
    };

    router.handle(req, res);

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith(req, res);
  });

  test('should return 404 for unknown route', () => {
    const router = new Router();

    const req = {
      method: 'GET',
      url: '/unknown',
    };

    const res = {
      writeHead: jest.fn(),
      end: jest.fn(),
    };

    router.handle(req, res);

    expect(res.writeHead).toHaveBeenCalledWith(404, {
      'Content-Type': 'text/plain; charset=utf-8',
    });
    expect(res.end).toHaveBeenCalledWith('404 Not Found');
  });

  test('should match pathname without query string', () => {
    const router = new Router();
    const handler = jest.fn();

    router.register('GET', '/account', handler);

    const req = {
      method: 'GET',
      url: '/account?id=1',
    };

    const res = {
      writeHead: jest.fn(),
      end: jest.fn(),
    };

    router.handle(req, res);

    expect(handler).toHaveBeenCalled();
  });
});