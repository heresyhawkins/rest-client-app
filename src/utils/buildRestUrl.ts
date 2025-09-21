import { encodeBase64, buildQuery } from './urlEncoding';

interface BuildUrlOptions {
  method: string;
  url: string;
  body?: string;
  headers?: Record<string, string>;
}

export function buildRestUrl({
  method,
  url,
  body = '',
  headers = {},
}: BuildUrlOptions) {
  const methodUpper = method.toUpperCase();

  const urlEncoded = encodeBase64(url);
  const bodyEncoded = body ? encodeBase64(body) : '';

  const query = buildQuery(headers);

  let path = `/rest/${methodUpper}/${urlEncoded}`;
  if (bodyEncoded) {
    path += `/${bodyEncoded}`;
  }

  if (query) {
    path += `?${query}`;
  }

  return path;
}
