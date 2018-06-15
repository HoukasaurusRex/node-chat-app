const expect = require('expect');

const { isRealString } = require('./validation');

describe('isRealString', () => {
  it('should reject non-string values', () => {
    const nonString = 25;
    const res = isRealString(nonString);
    expect(res).toBeFalsy;
  });
  it('should reject string with only spaces', () => {
    const spaces = '   ';
    const res = isRealString(spaces);
    expect(res).toBeFalsy;
  });
  it('should allow string with non-space characters', () => {
    const string = ' JT Houk  ';
    const res = isRealString(string);
    expect(res).toBeTruthy;
  });
});
