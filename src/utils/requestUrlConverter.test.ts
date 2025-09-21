import { describe, expect, it } from 'vitest';
import {
  convertRequestToUrl,
  convertUrlToRequest,
} from '@utils/requestUrlConverter';
import {
  paramsFull,
  requestFull,
  requestMethodOnly,
  searchParams,
  urlFull,
  urlMethodOnly,
} from '../test-data/request-url-converter-data';

describe('Request-url converter tests', () => {
  it('Should convert url to request successfully', () => {
    expect(convertUrlToRequest(paramsFull, searchParams)).toStrictEqual(
      requestFull
    );
  });

  it('Should convert request to url successfully', () => {
    expect(convertRequestToUrl(requestFull)).toBe(urlFull);
    expect(convertRequestToUrl(requestMethodOnly)).toBe(urlMethodOnly);
  });
});
