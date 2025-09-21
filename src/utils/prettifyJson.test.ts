import { describe, expect } from 'vitest';
import { prettifyJson } from '@utils/prettifyJson';

const prettifiedJson =
  '{\n  "text": "text",\n  "object": {\n    "prop1": "prop1",\n    "prop2": "prop2"\n  }\n}';

describe('Test prettifyJson function', () => {
  it('Should return a string in case of regular text provided', () => {
    const text = 'Hello World!';
    expect(prettifyJson(text)).toBe(`"${text}"`);
  });

  it('Should return prettified json', () => {
    const json =
      '{"text": "text","object": {"prop1": "prop1", "prop2": "prop2"}}';
    expect(prettifyJson(json)).toBe(prettifiedJson);
  });
});
