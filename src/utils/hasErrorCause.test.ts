import { describe, it, expect } from 'vitest';
import { hasErrorCauseCode } from '@utils/hasErrorCause';

describe('hasErrorCause function tests', () => {
  it('Should return true is object has code property', () => {
    expect(
      hasErrorCauseCode({
        code: 401,
      })
    ).toBe(true);
  });

  it('Should return false is object does not have code property', () => {
    expect(
      hasErrorCauseCode({
        status: 401,
      })
    ).toBe(false);
  });
});
