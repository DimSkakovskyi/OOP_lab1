const { parseCookies } = require('../../src/utils/cookies');

describe('parseCookies', () => {
  test('should parse cookie string', () => {
    const result = parseCookies('sessionId=abc123; theme=dark');

    expect(result).toEqual({
      sessionId: 'abc123',
      theme: 'dark',
    });
  });

  test('should return empty object for empty string', () => {
    expect(parseCookies('')).toEqual({});
  });
});