import { describe, it, expect } from 'vitest';
import * as firebaseService from '@services/firebase.service';
import * as nextHeaders from 'next/headers';
import * as auth from 'firebase/auth';
import {
  getCookie,
  isAuthenticated,
  loginUser,
  registerUser,
  removeAuthCookie,
} from '@actions/auth-actions';

const mockUser = {
  uid: 'test_uid',
  email: 'test_email',
  getIdToken: async () => 'test_id_token',
} as unknown as auth.User;

const cookieStore: Record<string, string> = {};

vi.mock('next/headers', () => ({
  cookies: () =>
    ({
      get: (name: string) => {
        if (cookieStore[name]) return { value: cookieStore[name] };
        return undefined;
      },
      set: (name: string, value: string) => {
        cookieStore[name] = value;
      },
      delete: (name: string) => {
        Reflect.deleteProperty(cookieStore, name);
      },
    }) as unknown as ReturnType<typeof nextHeaders.cookies>,
}));

describe('Auth Actions tests', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    Object.keys(cookieStore).forEach((key) =>
      Reflect.deleteProperty(cookieStore, key)
    );
    vi.spyOn(firebaseService, 'loginWithEmailAndPassword').mockResolvedValue(
      mockUser
    );
    vi.spyOn(
      firebaseService,
      'registerUserWithEmailAndPassword'
    ).mockResolvedValue(mockUser);
  });

  it('Should call registerUserWithEmailAndPassword', async () => {
    await registerUser({ email: 'test', password: 'test' });
    expect(firebaseService.registerUserWithEmailAndPassword).toBeCalledWith(
      'test',
      'test'
    );
  });

  it('Should call loginWithEmailAndPassword', async () => {
    vi.spyOn(firebaseService, 'loginWithEmailAndPassword').mockRejectedValue(
      new Error('Failed to login')
    );
    const result = await loginUser({ email: 'test', password: 'test' });
    expect(result.success).toBe(false);
  });

  it('Should return success = false in case of firebase error', async () => {
    await loginUser({ email: 'test', password: 'test' });
    expect(firebaseService.loginWithEmailAndPassword).toBeCalledWith(
      'test',
      'test'
    );
    expect(cookieStore['userUid']).toBe(mockUser.uid);
    expect(cookieStore['userEmail']).toBe(mockUser.email);
    expect(cookieStore['authToken']).toBe('test_id_token');
  });

  it('Should return true if user authenticated', async () => {
    cookieStore['authToken'] = 'test_token';
    expect(await isAuthenticated()).toBe(true);
  });

  it('Should remove auth token', async () => {
    cookieStore['authToken'] = 'test_token';
    await removeAuthCookie();
    expect(cookieStore['authToken']).toBe(undefined);
  });

  it('Should return cookie by name or empty string', async () => {
    cookieStore['authToken'] = 'test_token';
    expect(await getCookie('authToken')).toBe('test_token');
    expect(await getCookie('unknownCookie')).toBe('');
  });
});
