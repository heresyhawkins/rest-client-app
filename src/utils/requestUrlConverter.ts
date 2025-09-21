import { Params } from 'next/dist/server/request/params';
import { ReadonlyURLSearchParams } from 'next/navigation';
import { RequestType } from '@types';
import { base64ToString, stringToBase64 } from '@utils/stringBase64Converter';

export function convertUrlToRequest(
  params: Params,
  searchParams?: ReadonlyURLSearchParams
): RequestType {
  const paramsObj: Record<string, string> = {};
  if (searchParams) {
    searchParams.forEach((value, key) => {
      paramsObj[key] = value;
    });
  }
  return {
    method: params.method?.toString() ?? '',
    url: base64ToString(params.requestpart ? params.requestpart[0] : undefined),
    body: base64ToString(
      params.requestpart ? params.requestpart[1] : undefined
    ),
    headers: paramsObj,
  };
}

export function convertRequestToUrl(request: RequestType): string {
  const searchParams = new URLSearchParams();
  const parts: string[] = [];

  const encodedUrl = stringToBase64(request.url);
  const encodedBody = stringToBase64(request.body);

  if (encodedUrl) parts.push(encodedUrl);
  if (encodedBody) parts.push(encodedBody);

  Object.entries(request.headers || {}).forEach(([key, value]) => {
    if (value != null) {
      searchParams.append(key, value);
    }
  });

  const path = parts.length > 0 ? `/${parts.join('/')}` : '';
  const query = searchParams.toString();
  return path + (query ? `?${query}` : '');
}
