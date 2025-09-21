import { isValidJson } from './isValidJson';

export function prettifyJson(text: string) {
  return isValidJson(text)
    ? JSON.stringify(JSON.parse(text), null, 2)
    : JSON.stringify(text);
}
