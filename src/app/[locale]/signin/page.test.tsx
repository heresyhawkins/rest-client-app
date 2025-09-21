import { render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import SignInPage from './page';

vi.mock('@utils/redirects', () => ({
  redirectIfAuthenticated: vi.fn(),
}));
vi.mock('@components', () => ({
  AuthForm: () => <div data-testid="auth-form">Auth Form</div>,
}));

import { redirectIfAuthenticated } from '@utils/redirects';

describe('SignInPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls redirectIfAuthenticated with locale param', async () => {
    const params = Promise.resolve({ locale: 'en' });

    render(await SignInPage({ params }));

    await waitFor(() => {
      expect(redirectIfAuthenticated).toHaveBeenCalledWith('en');
    });
  });

  it('renders AuthForm when not redirected', async () => {
    const params = Promise.resolve({ locale: 'en' });

    render(await SignInPage({ params }));

    expect(screen.getByTestId('auth-form')).toBeInTheDocument();
  });
});
