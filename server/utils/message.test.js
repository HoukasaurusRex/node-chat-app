const expect = require('expect');

const { generateMessage } = require('./message');

describe('generateMessage', () => {
  it('should generate correct message object', () => {
    const from = 'JT';
    const text = 'What up';
    const res = generateMessage(from, text);

    expect(res).toMatchObject({ from, text});
    expect(typeof res.createdAt).toBe('number');
  });
});
