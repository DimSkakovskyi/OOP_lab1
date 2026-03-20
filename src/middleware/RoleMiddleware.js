const AuthMiddleware = require('./AuthMiddleware');

class RoleMiddleware {
  static requireAdmin(req, res) {
    const currentUser = AuthMiddleware.requireAuth(req, res);

    if (!currentUser) {
      return null;
    }

    if (currentUser.role !== 'ADMIN') {
      res.writeHead(403, {
        'Content-Type': 'text/plain; charset=utf-8',
      });
      res.end('Access denied');
      return null;
    }

    return currentUser;
  }
}

module.exports = RoleMiddleware;