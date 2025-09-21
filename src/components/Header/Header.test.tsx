import {
  render,
  screen,
  fireEvent,
  cleanup,
  waitFor,
} from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import uiReducer, { UiState } from '../../states/uiSlice';
import { Header } from './Header';
import { describe, it, expect, beforeEach, vi, Mock } from 'vitest';
import { userEvent } from '@testing-library/user-event';
import { removeAuthCookie } from '@actions/auth-actions';

vi.mock('@actions/auth-actions', () => ({
  removeAuthCookie: vi.fn(),
}));

const pushMock = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock }),
  usePathname: () => '/en/main',
}));

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const dict: Record<string, string> = {
      main: 'Main',
      signout: 'Sign out',
      signin: 'Sign in',
      signup: 'Sign up',
    };
    return dict[key] ?? key;
  },
  useLocale: () => 'en',
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: vi.fn() }),
  usePathname: () => '/en/main',
}));

const renderWithStore = (preloadedState?: { ui: UiState }) => {
  const store = configureStore({
    reducer: { ui: uiReducer },
    preloadedState,
  });

  return render(
    <Provider store={store}>
      <Header locale={preloadedState?.ui.locale || 'en'} />
    </Provider>
  );
};

describe('Header component', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'scrollY', { value: 0, writable: true });
    cleanup();
  });

  it('renders link Main', () => {
    renderWithStore({
      ui: { isAuthenticated: true, locale: 'en', user: 'test' },
    });
    expect(screen.getByText('Main')).toBeInTheDocument();
  });

  it('shows Sign out, if user is authenticated', () => {
    renderWithStore({
      ui: { isAuthenticated: true, locale: 'en', user: 'test' },
    });
    expect(screen.getByText('Sign out')).toBeInTheDocument();
  });

  it('shows Sign In and Sign Up if user is not authenticated', () => {
    renderWithStore({
      ui: { isAuthenticated: false, locale: 'en', user: 'test' },
    });
    expect(screen.getByText('Sign in')).toBeInTheDocument();
    expect(screen.getByText('Sign up')).toBeInTheDocument();
  });

  it("doesn't show Sign out, if user is not authenticated", () => {
    renderWithStore({
      ui: { isAuthenticated: false, locale: 'en', user: 'test' },
    });
    expect(screen.queryByText('Sign out')).not.toBeInTheDocument();
  });

  it('changes styles with scroll', () => {
    renderWithStore({
      ui: { isAuthenticated: true, locale: 'en', user: 'test' },
    });

    const header = screen.getByRole('banner');
    expect(header.className).toContain('bg-violet-300');
    expect(header.className).toContain('h-20');

    Object.defineProperty(window, 'scrollY', { value: 100, writable: true });
    fireEvent.scroll(window);

    expect(header.className).toContain('bg-violet-400');
    expect(header.className).toContain('h-14');
    expect(header.className).toContain('shadow-2xl');
  });

  it('dispatches signOut when button clicked', async () => {
    (removeAuthCookie as Mock).mockResolvedValue(undefined);
    const store = configureStore({
      reducer: { ui: uiReducer },
      preloadedState: {
        ui: { isAuthenticated: true, locale: 'en', user: 'test' },
      } satisfies { ui: UiState },
    });

    render(
      <Provider store={store}>
        <Header locale="en" />
      </Provider>
    );

    await userEvent.click(screen.getByText('Sign out'));
    await waitFor(
      () => expect(store.getState().ui.isAuthenticated).toBe(false),
      {
        timeout: 2000,
      }
    );
  });

  it('removes event listener on unmount', () => {
    const removeSpy = vi.spyOn(window, 'removeEventListener');

    const { unmount } = renderWithStore({
      ui: { isAuthenticated: true, locale: 'en', user: 'test' },
    });

    unmount();
    expect(removeSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
  });

  it('renders LanguageToggle and logo', () => {
    renderWithStore({
      ui: { isAuthenticated: false, locale: 'en', user: 'test' },
    });

    expect(screen.getByLabelText('Go to main page')).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Go to main page' })
    ).toBeInTheDocument();
    expect(screen.getByTestId('language-toggle')).toBeInTheDocument();
  });

  it('does not show Main link when user is not authenticated', () => {
    renderWithStore({
      ui: { isAuthenticated: false, locale: 'en', user: 'test' },
    });
    expect(screen.queryByText('Main')).not.toBeInTheDocument();
  });
});
