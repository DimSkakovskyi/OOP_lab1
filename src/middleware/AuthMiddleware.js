const { parseCookies } = require('../utils/cookies');
const { getSession } = require('../utils/sessionStore');

class AuthMiddleware {
  static getCurrentUser(req) {
    const cookies = parseCookies(req.headers.cookie || '');
    const sessionId = cookies.sessionId;

    if (!sessionId) {
      return null;
    }

    const session = getSession(sessionId);

    if (!session) {
      return null;
    }

    return session.user;
  }

  static requireAuth(req, res) {
    const currentUser = this.getCurrentUser(req);

    if (!currentUser) {
      res.writeHead(302, { Location: '/login' });
      res.end();
      return null;
    }

    return currentUser;
  }
}

module.exports = AuthMiddleware;