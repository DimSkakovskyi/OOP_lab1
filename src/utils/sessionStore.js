const sessions = new Map();

function createSession(user) {
  const sessionId =
    Date.now().toString(36) + Math.random().toString(36).slice(2);

  sessions.set(sessionId, { user });

  return sessionId;
}

function getSession(sessionId) {
  return sessions.get(sessionId) || null;
}

function deleteSession(sessionId) {
  sessions.delete(sessionId);
}

module.exports = {
  createSession,
  getSession,
  deleteSession,
};