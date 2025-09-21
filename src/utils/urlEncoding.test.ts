import { describe, it, expect } from 'vitest';
import {
  encodeBase64,
  decodeBase64,
  buildQuery,
  parseQuery,
} from './urlEncoding';

const sample = 'Hello World!';
const sampleBase64 = 'SGVsbG8gV29ybGQh';

describe('urlEncoding utils', () => {
  describe('encodeBase64 / decodeBase64', () => {
    it('should encode string to base64', () => {
      expect(encodeBase64(sample)).toBe(sampleBase64);
    });

    it('should decode base64 to original string', () => {
      expect(decodeBase64(sampleBase64)).toBe(sample);
    });

    it('should return empty string when input is empty', () => {
      expect(encodeBase64('')).toBe('');
      expect(decodeBase64('')).toBe('');
    });

    it('should handle undefined gracefully', () => {
      expect(decodeBase64(undefined)).toBe('');
    });
  });

  describe('buildQuery / parseQuery', () => {
    it('should build query string from headers object', () => {
      const headers = {
        Accept: 'application/json',
        Authorization: 'Bearer abc',
      };
      const query = buildQuery(headers);

      expect(query).toContain('Accept=application%2Fjson');
      expect(query).toContain('Authorization=Bearer+abc');
    });

    it('should parse query string back to object', () => {
      const query = 'Accept=application%2Fjson&Authorization=Bearer+abc';
      const headers = parseQuery(query);

      expect(headers).toEqual({
        Accept: 'application/json',
        Authorization: 'Bearer abc',
      });
    });

    it('should return empty object for empty query string', () => {
      expect(parseQuery('')).toEqual({});
    });
  });
});
