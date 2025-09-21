import { renderHook, act } from '@testing-library/react';
import { useApi } from './useApi';
import { vi, describe, it, expect, beforeEach } from 'vitest';

describe('useApi hook', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('handles successful fetch', async () => {
    const mockData = { message: 'ok' };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockData),
    });

    const { result } = renderHook(() => useApi());

    let data;
    await act(async () => {
      data = await result.current.fetcher<typeof mockData>('/test');
    });

    expect(global.fetch).toHaveBeenCalledWith('/test', undefined);
    expect(data).toEqual(mockData);
    expect(result.current.error).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it('handles error response', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      json: () => Promise.resolve({ message: 'Server exploded' }),
    });

    const { result } = renderHook(() => useApi());

    await expect(act(() => result.current.fetcher('/error'))).rejects.toThrow(
      'HTTP 500: Server exploded'
    );
  });

  it('handles network error', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Failed to fetch'));

    const { result } = renderHook(() => useApi());

    await act(async () => {
      const data = await result.current.fetcher('/network');
      expect(data).toBeNull();
    });

    expect(result.current.error).toContain('Failed to connect to the server');
    expect(result.current.loading).toBe(false);
  });

  it('handles unknown error type', async () => {
    global.fetch = vi.fn().mockRejectedValue('random string');

    const { result } = renderHook(() => useApi());

    await act(async () => {
      const data = await result.current.fetcher('/unknown');
      expect(data).toBeNull();
    });

    expect(result.current.error).toBe('An unknown error occurred.');
  });
});
