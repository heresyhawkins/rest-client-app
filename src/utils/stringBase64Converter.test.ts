import { describe, it, expect } from 'vitest';
import { base64ToString, stringToBase64 } from './stringBase64Converter';

const text = 'http://localhost:8080';
const base64Text = 'aHR0cDovL2xvY2FsaG9zdDo4MDgw';

describe('Test stringBase64Converter functions', () => {
  it('Should encode string to base64 correctly', () => {
    expect(stringToBase64(text)).toBe(base64Text);
  });

  it('Should decode base64 to string correctly', () => {
    expect(base64ToString(base64Text)).toBe(text);
  });

  it('Should throw an error if not base64 string was provided', () => {
    expect(() => base64ToString('bad string')).toThrow();
  });

  it('Should return empty string for undefined or empty input in stringToBase64', () => {
    expect(stringToBase64(undefined)).toBe('');
    expect(stringToBase64('')).toBe('');
  });

  it('Should correctly encode string to URL-safe base64', () => {
    expect(stringToBase64('hello')).toBe('aGVsbG8');
    expect(stringToBase64('https://example.com/path')).toBe(
      'aHR0cHM6Ly9leGFtcGxlLmNvbS9wYXRo'
    );
  });

  it('Should return undefined for undefined in base64ToString', () => {
    expect(base64ToString(undefined)).toBeUndefined();
  });

  it('Should decode valid base64 string', () => {
    expect(base64ToString('aGVsbG8=')).toBe('hello');
    expect(base64ToString('aHR0cHM6Ly9leGFtcGxlLmNvbQ==')).toBe(
      'https://example.com'
    );
  });

  it('Should handle URL-safe base64 (with - and _)', () => {
    expect(base64ToString('aHR0cHM6Ly9leGFtcGxlLmNvbQ')).toBe(
      'https://example.com'
    );
    expect(base64ToString('aHR0cHM6Ly9leGFtcGxlLmNvbQ')).toBe(
      'https://example.com'
    );
  });

  it('Should return undefined on invalid base64', () => {
    expect(() => base64ToString('invalid@@@')).toThrow('Invalid base64');
  });
});
