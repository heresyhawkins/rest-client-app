import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { RestClient } from './RestClient';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { convertUrlToRequest } from '@utils/requestUrlConverter';
import { buildRestUrl } from '@utils/buildRestUrl';

vi.mock('next/navigation');
vi.mock('next-intl');
vi.mock('@utils/requestUrlConverter');
vi.mock('@utils/buildRestUrl');
vi.mock('@components', () => ({
  MethodSelector: ({
    value,
    onChange,
  }: {
    value: string;
    onChange: (value: string) => void;
  }) => (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      data-testid="method-selector"
    >
      <option value="GET">GET</option>
      <option value="POST">POST</option>
    </select>
  ),
  EndpointInput: ({
    value,
    onChange,
  }: {
    value: string;
    onChange: (value: string) => void;
  }) => (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      data-testid="endpoint-input"
    />
  ),
  HeadersEditor: () => <div data-testid="headers-editor" />,
  BodyEditor: ({
    value,
    onChange,
  }: {
    value: string;
    onChange: (value: string) => void;
  }) => (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      data-testid="body-editor"
    />
  ),
  ResponseViewer: ({ data }: { data: unknown }) => (
    <div data-testid="response-viewer">{JSON.stringify(data)}</div>
  ),
}));

const mockUseParams = vi.mocked(useParams);
const mockUseSearchParams = vi.mocked(useSearchParams);
const mockUseRouter = vi.mocked(useRouter);
const mockUseTranslations = vi.mocked(useTranslations);
const mockConvertUrlToRequest = vi.mocked(convertUrlToRequest);
const mockBuildRestUrl = vi.mocked(buildRestUrl);

describe('RestClient', () => {
  const mockReplace = vi.fn();

  beforeEach(() => {
    mockUseParams.mockReturnValue({});
    mockUseSearchParams.mockReturnValue(
      new URLSearchParams() as unknown as ReturnType<typeof useSearchParams>
    );
    mockUseRouter.mockReturnValue({ replace: mockReplace } as never);
    mockUseTranslations.mockReturnValue(
      Object.assign(
        (key: string) => {
          const translations: Record<string, string> = {
            title: 'REST Client',
            'RestClient.sendRequest': 'Send Request',
            'RestClient.response': 'Response',
            invalidJson: 'Invalid JSON',
          };
          return translations[key] ?? key;
        },
        {
          rich: () => '',
          markup: () => '',
          raw: () => '',
          has: () => true,
        }
      ) as ReturnType<typeof useTranslations>
    );

    mockConvertUrlToRequest.mockReturnValue({
      method: 'GET',
      url: '',
      body: '',
      headers: {},
    });

    mockBuildRestUrl.mockImplementation(({ method, url }) => {
      return `/rest/${method}/${encodeURIComponent(url)}`;
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly', () => {
    render(<RestClient />);
    expect(screen.getByText('REST Client')).toBeInTheDocument();
  });

  it('validates JSON body', async () => {
    render(<RestClient />);

    fireEvent.change(screen.getByTestId('body-editor'), {
      target: { value: '{ invalid json' },
    });

    expect(screen.getByText('Invalid JSON')).toBeInTheDocument();
  });

  it('handles successful request', async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      status: 200,
      statusText: 'OK',
      headers: new Headers({ 'content-type': 'application/json' }),
      json: () => Promise.resolve({ success: true }),
    });

    render(<RestClient />);

    fireEvent.change(screen.getByTestId('endpoint-input'), {
      target: { value: 'https://api.example.com' },
    });

    fireEvent.click(screen.getByTestId('send-btn'));

    await waitFor(() => {
      expect(screen.getByTestId('response-viewer')).toHaveTextContent(
        JSON.stringify({ success: true })
      );
    });
  });

  it('handles request error', async () => {
    global.fetch = vi.fn().mockRejectedValueOnce(new Error('Network error'));

    render(<RestClient />);

    fireEvent.change(screen.getByTestId('endpoint-input'), {
      target: { value: 'https://api.example.com' },
    });

    fireEvent.click(screen.getByTestId('send-btn'));

    await waitFor(() => {
      expect(screen.getByText('Network error')).toBeInTheDocument();
    });
  });
});
