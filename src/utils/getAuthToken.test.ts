import { describe, expect, it } from 'vitest';
import { getAuthToken } from './getAuthToken';

const mockRequest = (cookieHeader?: string) => {
  return {
    headers: {
      get: (name: string) => (name === 'cookie' ? cookieHeader : null),
    },
  } as unknown as Request;
};

describe('getAuthToken function tests', () => {
  it('Should return authToken from cookies', async () => {
    const request = mockRequest(
      'authToken=123; someCookie=some; otherCookie=other'
    );
    const token = await getAuthToken(request);
    expect(token).toBe('123');
  });

  it('Should return undefined if no authToken', async () => {
    const request = mockRequest('someCookie=some; otherCookie=other');
    const token = await getAuthToken(request);
    expect(token).toBeUndefined();
  });

  it('Should return undefined if no cookies', async () => {
    const request = mockRequest();
    const token = await getAuthToken(request);
    expect(token).toBeUndefined();
  });
});
