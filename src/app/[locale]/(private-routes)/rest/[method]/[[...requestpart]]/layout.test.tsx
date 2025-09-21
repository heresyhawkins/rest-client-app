import { describe, it, expect, vi, beforeEach } from 'vitest';
import RestClientLayout from './layout';
import { notFound } from 'next/navigation';

vi.mock('@utils/redirects', () => ({
  redirectIfNotAuthenticated: vi.fn(),
}));
vi.mock('next/navigation', () => ({
  notFound: vi.fn(),
}));

describe('RestClientLayout', () => {
  const mockChildren = <div>Mock Children</div>;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render children if method is valid and requestpart is empty', async () => {
    const result = await RestClientLayout({
      children: mockChildren,
      params: Promise.resolve({ locale: 'en', method: 'GET' }),
    });

    expect(result?.props.children).toEqual(mockChildren);
    expect(notFound).not.toHaveBeenCalled();
  });

  it('should call notFound if method is invalid', async () => {
    await RestClientLayout({
      children: mockChildren,
      params: Promise.resolve({ locale: 'en', method: 'INVALID' }),
    });

    expect(notFound).toHaveBeenCalled();
  });

  it('should call notFound if requestpart has more than 2 items', async () => {
    await RestClientLayout({
      children: mockChildren,
      params: Promise.resolve({
        locale: 'en',
        method: 'GET',
        requestpart: ['a', 'b', 'c'],
      }),
    });

    expect(notFound).toHaveBeenCalled();
  });

  it('should allow valid method with requestpart length 2', async () => {
    const result = await RestClientLayout({
      children: mockChildren,
      params: Promise.resolve({
        locale: 'en',
        method: 'POST',
        requestpart: ['url', 'body'],
      }),
    });

    expect(result?.props.children).toEqual(mockChildren);

    expect(notFound).not.toHaveBeenCalled();
  });

  it('should render children if requestpart is undefined', async () => {
    const result = await RestClientLayout({
      children: mockChildren,
      params: Promise.resolve({
        locale: 'en',
        method: 'GET',
        requestpart: undefined,
      }),
    });

    expect(result?.props.children).toEqual(mockChildren);
    expect(notFound).not.toHaveBeenCalled();
  });
});
