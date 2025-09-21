'use server';

import {
  loginWithEmailAndPassword,
  registerUserWithEmailAndPassword,
} from '@services/firebase.service';
import { cookies } from 'next/headers';
import { User } from '@firebase/auth';
import { UserAuth } from '@types';
import { getToken } from '@utils/getAuthToken';
import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';

export async function loginUser({ email, password }: UserAuth) {
  return await processUserAuth(() =>
    loginWithEmailAndPassword(email, password)
  );
}

export async function registerUser({ email, password }: UserAuth) {
  return await processUserAuth(() =>
    registerUserWithEmailAndPassword(email, password)
  );
}

export async function processUserAuth(func: () => Promise<User | undefined>) {
  try {
    const user = await func();
    if (user) {
      await addUserCookies(user);
    }
    return { success: true };
  } catch (error) {
    let errorMessage = 'Something went wrong';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return { success: false, errorMessage };
  }
}

export async function removeAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete('authToken');
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  return getToken(cookieStore) !== undefined;
}

async function addUserCookies(user: User) {
  const cookieStore = await cookies();
  addCookie(cookieStore, 'userUid', user.uid);
  addCookie(cookieStore, 'userEmail', user.email ?? '');
  user.getIdToken(false).then((idToken) => {
    addCookie(cookieStore, 'authToken', idToken);
  });
}

export async function getCookie(name: string) {
  const cookieStore = await cookies();
  return cookieStore.get(name)?.value ?? '';
}

function addCookie(
  cookieStore: ReadonlyRequestCookies,
  name: string,
  value: string
) {
  cookieStore.set(name, value, {
    httpOnly: true,
    maxAge: 3600,
  });
}
