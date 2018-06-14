const expect = require('expect');

const { generateMessage, generateLocationMessage } = require('./message');

describe('generateMessage', () => {
  it('should generate correct message object', () => {
    const from = 'User';
    const text = 'What up';
    const res = generateMessage(from, text);

    expect(res).toMatchObject({ from, text });
    expect(typeof res.createdAt).toBe('number');
  });
});

describe('generateLocationMessage', () => {
  it('should generate correct location object', () => {
    const from = 'User';
    const latitude = 40;
    const longitude = 116;
    const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
    const res = generateLocationMessage(from, latitude, longitude);

    expect(res).toMatchObject({ from, url });
    expect(typeof res.createdAt).toBe('number');
  });
});
