const { parseBody } = require('../../src/utils/bodyParser');
const EventEmitter = require('events');

describe('bodyParser', () => {
  test('should parse urlencoded body', async () => {
    const req = new EventEmitter();

    const promise = parseBody(req);

    req.emit('data', Buffer.from('login=client1&password=client123'));
    req.emit('end');

    const result = await promise;

    expect(result).toEqual({
      login: 'client1',
      password: 'client123',
    });
  });
});