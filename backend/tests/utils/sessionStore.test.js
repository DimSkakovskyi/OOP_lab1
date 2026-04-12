const {
  createSession,
  getSession,
  deleteSession,
} = require('../../src/utils/sessionStore');

describe('sessionStore', () => {
  test('should create and get session', () => {
    const sessionId = createSession({
      id: 1,
      login: 'client1',
      role: 'CLIENT',
    });

    const session = getSession(sessionId);

    expect(session).not.toBeNull();
    expect(session.user.login).toBe('client1');
  });

  test('should delete session', () => {
    const sessionId = createSession({
      id: 2,
      login: 'admin1',
      role: 'ADMIN',
    });

    deleteSession(sessionId);

    const session = getSession(sessionId);

    expect(session).toBeNull();
  });
});