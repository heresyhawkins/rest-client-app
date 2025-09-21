import { describe, expect } from 'vitest';
import { generateCode } from '@utils/generateCode';
import {
  generatedCodeCurlPut,
  generatedCodeEmpty,
  generatedCodeFull,
  generatedCodePlainTextCSharp,
  generatedCodeWithoutBody,
  generatedCodeWithoutBodyAndHeaders,
  requestEmpty,
  requestFull,
  requestFullPlainText,
  requestFullPut,
  requestWithoutBody,
  requestWithoutBodyAndHeaders,
} from '../test-data/generate-code-data';
import { supportedLanguages } from '@data/supported-languages';

describe('Test generateCode function', () => {
  it('Should generate code for full request', () => {
    supportedLanguages.find((language) => {
      expect(generateCode(language, requestFull)).toBe(
        generatedCodeFull[language]
      );
    });
  });

  it('Should throw error in case of unsupported language', () => {
    expect(() => generateCode('ruby', requestFull)).toThrow(
      'Unsupported language: ruby'
    );
  });

  it('Should generate code for request without body', () => {
    supportedLanguages.find((language) => {
      expect(generateCode(language, requestWithoutBody)).toBe(
        generatedCodeWithoutBody[language]
      );
    });
  });

  it('Should generate code for request without body and headers', () => {
    supportedLanguages.forEach((language) => {
      expect(generateCode(language, requestWithoutBodyAndHeaders)).toBe(
        generatedCodeWithoutBodyAndHeaders[language]
      );
    });
  });

  it('Should generate code for empty request (method only)', () => {
    supportedLanguages.forEach((language) => {
      expect(generateCode(language, requestEmpty)).toBe(
        generatedCodeEmpty[language]
      );
    });
  });

  it('Should generate curl code for PUT method', () => {
    expect(generateCode('curl', requestFullPut)).toBe(generatedCodeCurlPut);
  });

  it('Should generate c# code for plain text', () => {
    expect(generateCode('c#', requestFullPlainText)).toBe(
      generatedCodePlainTextCSharp
    );
  });
});
