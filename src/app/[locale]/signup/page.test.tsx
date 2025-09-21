import { render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import SignUpPage from './page';

vi.mock('@utils/redirects', () => ({
  redirectIfAuthenticated: vi.fn(),
}));
vi.mock('@components', () => ({
  AuthForm: ({ isRegistration }: { isRegistration?: boolean }) => (
    <div data-testid="auth-form">
      Auth Form {isRegistration ? 'Registration' : 'Login'}
    </div>
  ),
}));

import { redirectIfAuthenticated } from '@utils/redirects';

describe('SignUpPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls redirectIfAuthenticated with locale param', async () => {
    const params = Promise.resolve({ locale: 'ru' });

    render(await SignUpPage({ params }));

    await waitFor(() => {
      expect(redirectIfAuthenticated).toHaveBeenCalledWith('ru');
    });
  });

  it('renders AuthForm with isRegistration=true', async () => {
    const params = Promise.resolve({ locale: 'ru' });

    render(await SignUpPage({ params }));

    const form = screen.getByTestId('auth-form');
    expect(form).toBeInTheDocument();
    expect(form).toHaveTextContent('Registration');
  });
});
