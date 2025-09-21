export function stringToBase64(text: string | undefined): string {
  if (!text) return '';
  return Buffer.from(text, 'utf-8')
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');
}
export function base64ToString(base64: string | undefined): string | undefined {
  if (base64 === undefined) return undefined;
  const base64Regex =
    /^(?:[A-Za-z0-9\-_]{4})*(?:[A-Za-z0-9\-_]{2}==|[A-Za-z0-9\-_]{3}=)?$/;

  let normalized = base64.replace(/-/g, '+').replace(/_/g, '/');

  while (normalized.length % 4 !== 0) {
    normalized += '=';
  }

  if (!base64Regex.test(normalized)) {
    throw new Error('Invalid base64');
  }

  const decoded = Buffer.from(base64, 'base64')
    .toString('utf-8')
    .replaceAll(/\r\n/g, '\n')
    .replaceAll('\x00', '');

  return decoded.trim();
}
