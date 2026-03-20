const AuthService = require('../services/AuthService');
const { parseBody } = require('../utils/bodyParser');
const { parseCookies } = require('../utils/cookies');
const { createSession, deleteSession } = require('../utils/sessionStore');
const AuthMiddleware = require('../middleware/AuthMiddleware');
const {
  renderView,
  redirect,
  sendError,
} = require('./helpers');

class AuthController {
  static async showLoginPage(req, res) {
    try {
      const currentUser = AuthMiddleware.getCurrentUser(req);

      if (currentUser) {
        if (currentUser.role === 'ADMIN') {
          return redirect(res, '/admin/accounts');
        }

        return redirect(res, '/accounts');
      }

      return renderView(res, 'login.ejs', {
        title: 'Login',
        error: null,
      });
    } catch (error) {
      return sendError(res, 500, error.message);
    }
  }

  static async login(req, res) {
    try {
      const body = await parseBody(req);
      const login = (body.login || '').trim();
      const password = body.password || '';

      if (!login || !password) {
        return renderView(res, 'login.ejs', {
          title: 'Login',
          error: 'Login and password are required',
        });
      }

      const user = await AuthService.login(login, password);
      const sessionId = createSession(user);

      res.writeHead(302, {
        Location: user.role === 'ADMIN' ? '/admin/accounts' : '/accounts',
        'Set-Cookie': `sessionId=${sessionId}; HttpOnly; Path=/`,
      });

      res.end();
    } catch (error) {
      return renderView(res, 'login.ejs', {
        title: 'Login',
        error: error.message,
      });
    }
  }

  static async logout(req, res) {
    try {
      const cookies = parseCookies(req.headers.cookie || '');
      const sessionId = cookies.sessionId;

      if (sessionId) {
        deleteSession(sessionId);
      }

      res.writeHead(302, {
        Location: '/login',
        'Set-Cookie': 'sessionId=; HttpOnly; Path=/; Max-Age=0',
      });

      res.end();
    } catch (error) {
      return sendError(res, 500, error.message);
    }
  }
}

module.exports = AuthController;