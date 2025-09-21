import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';

export async function getAuthToken(request: Request): Promise<string> {
  const cookieHeader = request.headers.get('cookie') || '';
  const cookies = Object.fromEntries(
    cookieHeader.split('; ').map((cookie) => {
      const [name, value] = cookie.split('=');
      return [name, value];
    })
  );

  return cookies['authToken'];
}

export function getToken(cookies: ReadonlyRequestCookies) {
  return cookies.get('authToken');
}
