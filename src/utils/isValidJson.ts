export function isValidJson(jsonString: string) {
  try {
    const json = JSON.parse(jsonString);
    return typeof json === 'object' && json !== null;
  } catch {
    return false;
  }
}
