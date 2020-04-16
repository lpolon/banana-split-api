import { isPasswordAllowed } from '../auth'

describe('isPasswordAllowed function', () => {
  it('accepts valid password', () => {
    const validPw = '!aBc123'

    const result = isPasswordAllowed(validPw)

    expect(result).toBe(true)
  })
  it('must have seven or more chars', () => {
    const tooShortPw = '!aBc12'

    const result = isPasswordAllowed(tooShortPw)

    expect(result).toBe(false)
  })
  it('must have alphabet chars', () => {
    const noABCPw = '!123456'
    const result = isPasswordAllowed(noABCPw)
    expect(result).toBe(false)
  })
  it('must have Numbers', () => {
    const noNumbersPw = '!aBCdfg'
    const result = isPasswordAllowed(noNumbersPw)
    expect(result).toBe(false)
  })
  it('must have uppercase letters', () => {
    const noUpperCasePw = '!abc123'
    const result = isPasswordAllowed(noUpperCasePw)
    expect(result).toBe(false)
  })
  it('must have lowercase letters', () => {
    const noLowerCasePw = '!ABC123'
    const result = isPasswordAllowed(noLowerCasePw)
    expect(result).toBe(false)
  })
  it('must have non-alphanumerical chars', () => {
    const noNonAlphaNumChars = 'ABc1234'
    const result = isPasswordAllowed(noNonAlphaNumChars)
    expect(result).toBe(false)
  })
})
