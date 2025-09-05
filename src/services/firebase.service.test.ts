import { describe, it, vi, expect, beforeEach, type Mock } from 'vitest';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { loginWithEmailAndPassword, logout, registerUserWithEmailAndPassword } from './firebase.service.ts';
import { FirebaseError } from "firebase/app";
import { INVALID_CREDENTIALS, NETWORK_ERROR } from "../data/error-messages.ts";

vi.mock('firebase/auth', () => {
  return {
    getAuth: vi.fn(() => ({})),
    createUserWithEmailAndPassword: vi.fn(),
    signInWithEmailAndPassword: vi.fn(),
    signOut: vi.fn()
  };
});

beforeEach(() => {
  vi.clearAllMocks();
});

describe('User registration tests', () => {
  it('Should resolve in case of successful registration', async () => {
    (createUserWithEmailAndPassword as Mock).mockResolvedValue({
      user: { uid: '123', email: 'test@example.com' },
    });

    const result = await registerUserWithEmailAndPassword('test@example.com', 'password');

    expect(createUserWithEmailAndPassword).toBeCalledWith(expect.any(Object), 'test@example.com', 'password');
    expect(result?.uid).toBe('123');
  });

  it('Should reject in case of error', async () => {
    (createUserWithEmailAndPassword as Mock)
      .mockRejectedValue(new FirebaseError('auth','email-already-in-use'));

    await expect(registerUserWithEmailAndPassword('test@example.com', 'password'))
      .rejects.toThrowError(INVALID_CREDENTIALS);

    expect(createUserWithEmailAndPassword).toHaveBeenCalled();
  });

  describe('User authentication tests', () => {
    it('Should resolve in case of successful authentication', async () => {
      (signInWithEmailAndPassword as Mock).mockResolvedValue({
        user: { uid: '123', email: 'test@example.com' },
      });

      const result = await loginWithEmailAndPassword('test@example.com', 'password');

      expect(signInWithEmailAndPassword).toBeCalledWith(expect.any(Object), 'test@example.com', 'password');
      expect(result?.uid).toBe('123');
    })
  });

  it('Should reject in case of error', async () => {
    (signInWithEmailAndPassword as Mock)
      .mockRejectedValue(new FirebaseError('auth','invalid-credentials'));

    await expect(loginWithEmailAndPassword('test@example.com', 'password'))
      .rejects.toThrowError(INVALID_CREDENTIALS);

    expect(signInWithEmailAndPassword).toHaveBeenCalled();
  });

  describe('Logout tests', () => {
    it('Should sign out a user', async () => {
      (signOut as Mock).mockResolvedValue(undefined);

      await logout();
      expect(signOut).toBeCalledWith(expect.any(Object));
      expect(signOut).toHaveBeenCalledTimes(1);
    });

    it('Should reject in case of error', async () => {
      (signOut as Mock).mockRejectedValue(new FirebaseError('auth','network-request-failed'));

      await expect(logout()).rejects.toThrowError(NETWORK_ERROR);
      expect(signOut).toHaveBeenCalled();
    })
  })
})