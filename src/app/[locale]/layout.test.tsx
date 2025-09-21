import { render, screen } from '@testing-library/react';
import RootLayout from './layout';
import { notFound } from 'next/navigation';
import { vi } from 'vitest';

vi.mock('next/navigation', () => ({
  notFound: vi.fn(),
}));

vi.mock('@actions/auth-actions', () => ({
  isAuthenticated: vi.fn().mockResolvedValue(true),
  getCookie: vi.fn().mockResolvedValue('test@example.com'),
}));

vi.mock('@components', () => ({
  Header: ({ locale }: { locale: string }) => (
    <div data-testid="header">Header {locale}</div>
  ),
  Footer: () => <div data-testid="footer">Footer</div>,
  ErrorBoundary: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
  FallbackUI: () => <div data-testid="fallback">Fallback</div>,
  ToastWrapper: () => <div data-testid="toast">Toast</div>,
}));

vi.mock('../layoutWrapper', () => ({
  LayoutWrapper: ({
    children,
  }: {
    children: React.ReactNode;
    locale: string;
    user: string;
    isAuthenticated: boolean;
  }) => <div data-testid="layout">{children}</div>,
}));

vi.mock('next-intl', () => ({
  NextIntlClientProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

describe('RootLayout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders children when locale is supported', async () => {
    render(
      await RootLayout({
        params: Promise.resolve({ locale: 'en' }),
        children: <div data-testid="child">Hello</div>,
      })
    );

    expect(screen.getByTestId('child')).toBeInTheDocument();
    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  it('calls notFound when locale is not supported', async () => {
    await RootLayout({
      params: Promise.resolve({ locale: 'xx' }),
      children: <div />,
    });

    expect(notFound).toHaveBeenCalled();
  });
});
