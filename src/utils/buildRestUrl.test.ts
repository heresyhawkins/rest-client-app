import { describe, it, expect } from 'vitest';
import { buildRestUrl } from './buildRestUrl';
import { encodeBase64 } from './urlEncoding';

describe('buildRestUrl', () => {
  it('should build URL with only method and url', () => {
    const url = 'https://api.example.com/users';
    const encodedUrl = encodeBase64(url);

    const result = buildRestUrl({
      method: 'get',
      url,
    });

    expect(result).toBe(`/rest/GET/${encodedUrl}`);
  });

  it('should build URL with body', () => {
    const url = 'https://api.example.com/posts';
    const body = JSON.stringify({ id: 1 });
    const encodedUrl = encodeBase64(url);
    const encodedBody = encodeBase64(body);

    const result = buildRestUrl({
      method: 'post',
      url,
      body,
    });

    expect(result).toBe(`/rest/POST/${encodedUrl}/${encodedBody}`);
  });

  it('should build URL with headers', () => {
    const url = 'https://api.example.com/data';
    const encodedUrl = encodeBase64(url);

    const result = buildRestUrl({
      method: 'get',
      url,
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer abc',
      },
    });

    expect(result.startsWith(`/rest/GET/${encodedUrl}?`)).toBe(true);
    expect(result).toContain('Accept=application%2Fjson');
    expect(result).toContain('Authorization=Bearer+abc');
  });

  it('should build URL with body and headers', () => {
    const url = 'https://api.example.com/data';
    const body = '{"foo":"bar"}';
    const encodedUrl = encodeBase64(url);
    const encodedBody = encodeBase64(body);

    const result = buildRestUrl({
      method: 'put',
      url,
      body,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    expect(result.startsWith(`/rest/PUT/${encodedUrl}/${encodedBody}?`)).toBe(
      true
    );
    expect(result).toContain('Content-Type=application%2Fjson');
  });

  it('should normalize method to uppercase', () => {
    const url = 'https://api.example.com/test';
    const encodedUrl = encodeBase64(url);

    const result = buildRestUrl({
      method: 'delete',
      url,
    });

    expect(result).toBe(`/rest/DELETE/${encodedUrl}`);
  });
});
