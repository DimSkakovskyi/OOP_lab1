const path = require('path');
const ejs = require('ejs');
const { parseCookies } = require('../utils/cookies');
const { getSession } = require('../utils/sessionStore');

async function renderView(res, viewName, data = {}) {
  const filePath = path.join(__dirname, '..', 'views', viewName);

  const html = await ejs.renderFile(filePath, data);

  res.writeHead(200, {
    'Content-Type': 'text/html; charset=utf-8',
  });

  res.end(html);
}

function redirect(res, location) {
  res.writeHead(302, { Location: location });
  res.end();
}

function sendError(res, statusCode, message) {
  res.writeHead(statusCode, {
    'Content-Type': 'text/plain; charset=utf-8',
  });
  res.end(message);
}

function getCurrentUser(req) {
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

function requireAuth(req, res) {
  const currentUser = getCurrentUser(req);

  if (!currentUser) {
    redirect(res, '/login');
    return null;
  }

  return currentUser;
}

function requireAdmin(req, res) {
  const currentUser = requireAuth(req, res);

  if (!currentUser) {
    return null;
  }

  if (currentUser.role !== 'ADMIN') {
    sendError(res, 403, 'Access denied');
    return null;
  }

  return currentUser;
}

module.exports = {
  renderView,
  redirect,
  sendError,
  getCurrentUser,
  requireAuth,
  requireAdmin,
};