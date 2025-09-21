import { RequestType } from '@types';

export function interpolateString(
  value: string,
  variables: Record<string, string>
) {
  let result = value;
  Object.keys(variables).forEach(
    (key) => (result = result.replaceAll(`{{${key}}}`, variables[key]))
  );
  return result;
}

export function interpolatePlainObject(
  object: Record<string, string>,
  variables: Record<string, string>
) {
  return Object.fromEntries(
    Object.entries(object)
      .map(([key, value]) => [
        interpolateString(key, variables),
        interpolateString(value, variables),
      ])
      .filter(([key, value]) => !/{{\w*}}/.test(key) && !/{{\w*}}/.test(value))
  );
}

export function interpolateRequest(
  request: RequestType,
  variables: Record<string, string>
): RequestType {
  const result = {} as RequestType;
  result.method = request.method;

  const interpolatedUrl = request.url
    ? interpolateString(request.url, variables)
    : request.url;
  result.url =
    interpolatedUrl && !/{{\w*}}/.test(interpolatedUrl)
      ? interpolatedUrl
      : undefined;

  const interpolatedBody = request.body
    ? interpolateString(request.body, variables)
    : request.body;
  result.body =
    interpolatedBody && !/{{\w*}}/.test(interpolatedBody)
      ? interpolatedBody
      : undefined;

  result.headers = request.headers
    ? interpolatePlainObject(request.headers, variables)
    : request.headers;

  return result;
}
