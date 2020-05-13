import { isPasswordAllowed, isUsernameAllowed } from '../auth';

import * as generate from '../../../test/util/generate';

describe('isPasswordAllowed function', () => {
  it('accepts valid password', () => {
    const validPw = generate.password();

    const result = isPasswordAllowed(validPw);

    expect(result).toBe(true);
  });
  it('must have seven or more chars', () => {
    const tooShortPw = '!aBc12';

    const result = isPasswordAllowed(tooShortPw);

    expect(result).toBe(false);
  });
  it('must have alphabet chars', () => {
    const noABCPw = '!123456';
    const result = isPasswordAllowed(noABCPw);
    expect(result).toBe(false);
  });
  it('must have Numbers', () => {
    const noNumbersPw = '!aBCdfg';
    const result = isPasswordAllowed(noNumbersPw);
    expect(result).toBe(false);
  });
  it('must have uppercase letters', () => {
    const noUpperCasePw = '!abc123';
    const result = isPasswordAllowed(noUpperCasePw);
    expect(result).toBe(false);
  });
  it('must have lowercase letters', () => {
    const noLowerCasePw = '!ABC123';
    const result = isPasswordAllowed(noLowerCasePw);
    expect(result).toBe(false);
  });
  it('must have non-alphanumerical chars', () => {
    const noNonAlphaNumChars = 'ABc1234';
    const result = isPasswordAllowed(noNonAlphaNumChars);
    expect(result).toBe(false);
  });
});

describe('isUsernameAllowed function', () => {
  it('returns false username with white spaces', () => {
    const whitespace = ' ';
    const usernameWithWhiteSpace = generate.username() + whitespace;
    const result = isUsernameAllowed(usernameWithWhiteSpace);
    expect(result).toStrictEqual(false);
  });
  it('returns false username with non-alphanumerical values but . or _', () => {
    const nonAlpha = '@';
    const usernameWithNonAlphachars = generate.username() + nonAlpha;
    const result = isUsernameAllowed(usernameWithNonAlphachars);
    expect(result).toStrictEqual(false);
  });
  it('returns false username with less than 3 chars', () => {
    const shortUsername = 'le';
    const result = isUsernameAllowed(shortUsername);
    expect(result).toStrictEqual(false);
  });
  it('returns false username with more than one dot', () => {
    const twoDotsUsername = 'leo.pol.on';
    const result = isUsernameAllowed(twoDotsUsername);
    expect(result).toStrictEqual(false);
  });
  it('returns true username with one dot', () => {
    const validUsernameWithDot = 'leo.polon';
    const result = isUsernameAllowed(validUsernameWithDot);
    expect(result).toStrictEqual(true);
  });
});
