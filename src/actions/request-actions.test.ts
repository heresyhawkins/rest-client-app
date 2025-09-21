import { describe, expect, it } from 'vitest';
import { processRequest } from '@actions/request-actions';
import * as firebaseService from '@services/firebase.service';
import * as authActions from './auth-actions';
import {
  mockResponseBodyJson,
  mockResponseBodyText,
  userRequest,
} from '../test-data/actions-data';

describe('Request Actions tests', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.spyOn(firebaseService, 'saveRequestData').mockResolvedValue(undefined);
    vi.spyOn(authActions, 'getCookie').mockResolvedValue('userUid');
  });

  it('Should return success result object for response json', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
      json: async () => mockResponseBodyJson,
    } as unknown as Response);

    const result = await processRequest(userRequest);

    expect(result.result).toBe('success');
    expect(result.body).toBe(mockResponseBodyJson.body);
  });

  it('Should throw in case of URL absent', async () => {
    await expect(
      processRequest({
        method: 'POST',
      })
    ).rejects.toThrowError();
  });

  it('Should return success result object for failed response', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
      text: async () => mockResponseBodyText,
    } as unknown as Response);

    const result = await processRequest(userRequest);

    expect(result.result).toBe('success');
    expect(result.body).toBe(mockResponseBodyText);
    expect(result.status).toBe(404);
  });

  it('Should return success result object for response text', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers(),
      text: async () => mockResponseBodyText,
    } as unknown as Response);

    const result = await processRequest(userRequest);

    expect(result.result).toBe('success');
    expect(result.body).toBe(mockResponseBodyText);
  });

  it('Should return error result object when fetch throw an error with cause', async () => {
    global.fetch = vi.fn().mockRejectedValue(
      new Error('request failed', {
        cause: {
          code: 'ENOTFOUND',
        },
      })
    );

    const result = await processRequest(userRequest);

    expect(result.result).toBe('error');
    expect(result.error).toBe('ENOTFOUND');
  });

  it('Should return error result object when fetch throw an error without cause', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('request failed'));

    const result = await processRequest(userRequest);

    expect(result.result).toBe('error');
    expect(JSON.stringify(result.error)).toBe(
      JSON.stringify(new Error('request failed'))
    );
  });
});
