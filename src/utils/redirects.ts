import { cookies } from 'next/headers';
import { getToken } from './getAuthToken';
import { redirect } from '@i18n/navigation';
import { routesList } from '@data/routes-list';

export async function redirectIfNotAuthenticated(locale: string) {
  const cookieStore = await cookies();
  const token = getToken(cookieStore);
  if (!token) {
    redirect({ href: `/${routesList.main}`, locale: locale });
  }

  return token;
}

export async function redirectIfAuthenticated(locale: string) {
  const cookieStore = await cookies();
  const token = getToken(cookieStore);
  if (token) {
    redirect({ href: `/${routesList.main}`, locale: locale });
  }
}
