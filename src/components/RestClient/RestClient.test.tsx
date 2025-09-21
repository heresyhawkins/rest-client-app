import { describe, it, vi, expect, beforeEach, Mock } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { RestClient } from '@components';
import { setMethod, setResponse } from '@states/restClientSlice';
import { setToastValue } from '@states/toastSlice';
import { NextIntlClientProvider } from 'next-intl';
import { userEvent } from '@testing-library/user-event';
import { processRequest } from '@actions/request-actions';
import { RootState } from '@store/store';
import { APIResponse } from '@types';

const mockDispatch = vi.fn();
const mockReplace = vi.fn();
const messages = {
  RestClient: {
    title: 'REST Client',
    sendRequest: 'Send Request',
    invalidJson:
      'Invalid JSON in body. Fix syntax or check your variables to send.',
    response: 'Response',
    button: 'Add',
    text: 'Enter request body...',
    error:
      'Please enter a valid URL (e.g. https://example.com) or check your variables',
    headersError: 'Please check your variables',
    copy: 'copy',
    method: 'Method',
    endpoint: 'Endpoint',
    headers: 'Headers',
    body: 'Body',
    textButton: 'Text',
    prettify: 'Prettify',
  },
  Messages: {
    requestSuccess: 'Request processed successfully',
    requestError: 'Failed to fetch. Reason: {error}',
  },
};

vi.mock('next/navigation', () => ({
  useParams: () => ({ method: 'get', requestpart: [] }),
  useSearchParams: () => new URLSearchParams(''),
}));

vi.mock('../../hooks/useAppStore', () => {
  function useAppSelector<T>(selector: (state: RootState) => T): T {
    const mockState: Partial<RootState> = {
      variables: { value: {} },
      restClient: {
        method: 'GET',
        endpoint: 'https://api.test',
        headers: {},
        body: '',
        isJson: false,
        response: {} as APIResponse,
        isLoading: false,
      },
    };
    return selector(mockState as RootState);
  }
  return {
    useAppDispatch: () => mockDispatch,
    useAppSelector,
  };
});

vi.mock('@actions/request-actions', () => ({
  processRequest: vi.fn(),
}));

vi.mock('@i18n/navigation', () => ({
  useRouter: () => ({ replace: mockReplace }),
}));

const renderWithIntl = () => {
  render(
    <NextIntlClientProvider messages={messages} locale="en">
      <RestClient />
    </NextIntlClientProvider>
  );
};

describe('RestClient component tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('Should render with initial method and endpoint', () => {
    renderWithIntl();

    expect(screen.getByText('REST Client')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Send Request/i })
    ).toBeInTheDocument();
  });

  it('Should dispatch method change', async () => {
    renderWithIntl();

    const selectorButton = screen.getByText('POST');
    await userEvent.click(selectorButton);

    expect(mockDispatch).toHaveBeenCalledWith(setMethod('POST'));
  });

  it('Should handle successful request submission', async () => {
    (processRequest as Mock).mockResolvedValue({
      result: 'success',
      status: 200,
      body: 'ok',
    });

    renderWithIntl();
    await userEvent.click(
      screen.getByRole('button', { name: /Send Request/i })
    );

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(
        setResponse({ status: 200, data: 'ok' })
      );
      expect(mockDispatch).toHaveBeenCalledWith(
        setToastValue({
          type: 'success',
          message: 'Request processed successfully',
        })
      );
      expect(mockReplace).toHaveBeenCalled();
    });
  });

  it('Should handle failed request submission', async () => {
    (processRequest as Mock).mockResolvedValue({
      result: 'error',
      error: 'Network fail',
    });

    renderWithIntl();
    await userEvent.click(
      screen.getByRole('button', { name: /Send Request/i })
    );

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(
        setToastValue({
          type: 'error',
          message: 'Failed to fetch. Reason: Network fail',
        })
      );
    });
  });
});
