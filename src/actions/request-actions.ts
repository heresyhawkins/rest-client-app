'use server';

import { RequestType } from '@types';
import { saveRequestData } from '@services/firebase.service';
import { getCookie } from '@actions/auth-actions';
import { emptyRequestData } from '@data/empty-request';
import { methods } from '@data/supported-methods';
import { hasErrorCauseCode } from '@utils/hasErrorCause';

export async function processRequest(request: RequestType) {
  if (!request.url) {
    throw new Error('Invalid url!');
  }

  const requestData = { ...emptyRequestData };
  requestData.method = request.method;
  requestData.requestSize = Buffer.byteLength(request.body ?? '');
  const start = Date.now();
  requestData.timestamp = new Date().toISOString();

  const options: Record<string, unknown> = {
    method: request.method,
    headers: request.headers,
    redirect: 'follow',
  };
  if (![methods.GET, methods.HEAD].includes(request.method)) {
    options.body = request.body;
  }
  try {
    const response = await fetch(request.url, options);
    requestData.latency = Date.now() - start;
    requestData.status = response.status;

    let result;
    const isJson = response.headers.get('content-type') === 'application/json';
    if (!response.ok) {
      result = await response.text();
      requestData.errorType = `${response.status}: ${response.statusText}`;
      requestData.responseSize = Buffer.byteLength(result);
    } else {
      if (isJson) {
        const json = await response.json();
        result = json.body;
      } else {
        result = await response.text();
      }
      requestData.responseSize = Buffer.byteLength(result);
    }

    requestData.url = request.url;
    requestData.headers = request.headers ?? {};
    requestData.body = request.body ?? '';

    await saveRequestData(await getCookie('userUid'), requestData);

    return {
      result: 'success',
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      body: result,
    };
  } catch (error) {
    return {
      result: 'error',
      error:
        error instanceof Error && hasErrorCauseCode(error.cause)
          ? error.cause.code
          : error,
    };
  }
}
