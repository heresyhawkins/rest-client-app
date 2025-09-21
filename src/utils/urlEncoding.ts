import { stringToBase64, base64ToString } from './stringBase64Converter';

export function encodeBase64(value: string): string {
  if (!value) return '';
  return stringToBase64(value) ?? '';
}

export function decodeBase64(value: string | undefined): string {
  if (!value) return '';
  return base64ToString(value) ?? '';
}

export function buildQuery(headers: Record<string, string>): string {
  const params = new URLSearchParams();
  Object.entries(headers)
    .filter(([key]) => key.trim())
    .forEach(([key, value]) => {
      params.append(key, value);
    });
  return params.toString();
}

export function parseQuery(query: string): Record<string, string> {
  const params = new URLSearchParams(query);
  const headers: Record<string, string> = {};
  params.forEach((value, key) => {
    if (key.trim()) headers[key] = value;
  });
  return headers;
}
