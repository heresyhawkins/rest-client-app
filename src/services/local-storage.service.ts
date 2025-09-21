import { stringToBase64 } from '@utils/stringBase64Converter';
import { isValidJson } from '@utils/isValidJson';

export function loadVariables(user: string | null): Record<string, string> {
  if (!user) return {};
  const item = localStorage.getItem(stringToBase64(user) as string);
  if (!item || item.length === 0) return {};
  return isValidJson(item) ? JSON.parse(item) : {};
}

export function saveVariables(
  user: string,
  variables: Record<string, string>
): void {
  localStorage.setItem(
    stringToBase64(user) as string,
    JSON.stringify(variables)
  );
}
