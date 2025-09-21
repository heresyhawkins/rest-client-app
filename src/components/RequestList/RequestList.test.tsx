import { describe, it, vi, expect, beforeEach, Mock } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { RequestList } from '@components';
import { setToastValue } from '@states/toastSlice';
import { NextIntlClientProvider } from 'next-intl';
import { RequestType } from '@types';

const mockDispatch = vi.fn();
const { loadRequestData } = await import('services/firebase.service');
const { getCookie } = await import('@actions/auth-actions');
const messages = {
  History: {
    noRequests: 'You have not yet executed requests',
    tryRestClient: 'Try creating your first request in the REST Client.',
    restClient: 'REST Client',
    history: 'History Requests',
    time: 'Time',
    status: 'Status',
    date: 'Date',
    error: 'Error',
    method: 'Method',
    url: 'Url',
    errorUrl: 'Invalid URL',
    loading: 'Loading Content...',
    latency: 'Latency',
    responseSize: 'Response Size',
    requestSize: 'Request Size',
    failedToLoadHistory:
      'Failed to load request history. Please try again later.',
  },
};

vi.mock('services/firebase.service', () => ({
  loadRequestData: vi.fn(),
}));

vi.mock('@actions/auth-actions', () => ({
  getCookie: vi.fn(),
}));

vi.mock('../../hooks/useAppStore', () => ({
  useAppDispatch: () => mockDispatch,
}));

vi.mock('@utils/requestUrlConverter', () => ({
  convertRequestToUrl: (req: RequestType) => `/mock/${req.url}`,
}));

vi.mock('next-intl', async (importOriginal) => {
  const actual = await importOriginal<typeof import('next-intl')>();
  return {
    ...actual,
    useLocale: () => 'en',
  };
});

const renderWithIntl = () => {
  return render(
    <NextIntlClientProvider messages={messages} locale="en">
      <RequestList />
    </NextIntlClientProvider>
  );
};

describe('RequestList component tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('Should show loading fallback', () => {
    renderWithIntl();

    expect(screen.getByText(/Loading request history/)).toBeInTheDocument();
  });

  it('Should render empty state when no user', async () => {
    (getCookie as Mock).mockResolvedValue(null);

    renderWithIntl();

    await waitFor(() =>
      expect(
        screen.getByText(/You have not yet executed requests/)
      ).toBeInTheDocument()
    );
    expect(
      screen.getByText(/Try creating your first request in the REST Client./)
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'REST Client' })
    ).toBeInTheDocument();
  });

  it('Should render request list when valid requests exist', async () => {
    (getCookie as Mock).mockResolvedValue('test@test.test');
    (loadRequestData as Mock).mockResolvedValue([
      {
        method: 'GET',
        url: 'http://localhost:8080',
        status: 200,
        latency: 100,
        requestSize: 1024,
        responseSize: 2048,
        timestamp: Date.now(),
      },
    ]);

    renderWithIntl();

    await waitFor(() =>
      expect(screen.getByText('History Requests')).toBeInTheDocument()
    );
    expect(screen.getByText('GET')).toBeInTheDocument();
    expect(screen.getByText('http://localhost:8080')).toBeInTheDocument();
    expect(screen.getByText('200')).toBeInTheDocument();
  });

  it('dispatches toast on error', async () => {
    (getCookie as Mock).mockResolvedValue('user-123');
    (loadRequestData as Mock).mockRejectedValue(new Error('Firebase fail'));

    renderWithIntl();

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(
        setToastValue({
          type: 'error',
          message: 'Failed to load request history. Please try again later.',
        })
      );
    });
  });
});
