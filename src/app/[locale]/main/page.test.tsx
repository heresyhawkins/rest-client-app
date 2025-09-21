import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore, type Store } from '@reduxjs/toolkit';
import { NextIntlClientProvider } from 'next-intl';
import { type ReactNode, type ComponentProps } from 'react';
import Main from './page';

interface MockLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
}

interface UIState {
  isAuthenticated: boolean;
  user: string | null;
}

interface RootState {
  ui: UIState;
}

vi.mock('next/link', () => ({
  default: ({ href, children, className }: MockLinkProps) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}));

vi.mock('@data/routes-list', () => ({
  routesList: {
    login: 'login',
    register: 'register',
    client: 'client',
    history: 'history',
    variables: 'variables',
  },
}));

vi.mock('@data/supported-methods', () => ({
  methods: {
    GET: 'GET',
  },
}));

const mockMessages = {
  MainPage: {
    welcome: 'Welcome to the App',
    signin: 'Sign In',
    signup: 'Sign Up',
    welcomeBack: 'Welcome back, {user}!',
    rest: 'REST Client',
    history: 'History',
    variables: 'Variables',
  },
};

const createMockStore = (
  isAuthenticated: boolean,
  user: string | null = null
): Store<RootState> => {
  const uiReducer = (state: UIState = { isAuthenticated, user }): UIState => {
    return state;
  };

  return configureStore({
    reducer: {
      ui: uiReducer,
    },
    preloadedState: {
      ui: {
        isAuthenticated,
        user,
      },
    },
  });
};

const renderWithProviders = (
  isAuthenticated: boolean,
  user: string | null = null
) => {
  const store = createMockStore(isAuthenticated, user);

  const nextIntlProps: ComponentProps<typeof NextIntlClientProvider> = {
    locale: 'en',
    messages: mockMessages,
    timeZone: 'UTC',
    children: <Main />,
  };

  return render(
    <Provider store={store}>
      <NextIntlClientProvider {...nextIntlProps} />
    </Provider>
  );
};

describe('Main Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('When user is not authenticated', () => {
    it('should render welcome message and auth links', () => {
      renderWithProviders(false);

      expect(screen.getByText('Welcome to the App')).toBeInTheDocument();
      const signInLink = screen.getByText('Sign In');
      expect(signInLink).toBeInTheDocument();
      const signInAnchor = signInLink.closest('a');
      expect(signInAnchor).toHaveAttribute('href', '/login');
      const signUpLink = screen.getByText('Sign Up');
      expect(signUpLink).toBeInTheDocument();
      const signUpAnchor = signUpLink.closest('a');
      expect(signUpAnchor).toHaveAttribute('href', '/register');
    });

    it('should not render authenticated user content', () => {
      renderWithProviders(false);

      expect(screen.queryByText('REST Client')).not.toBeInTheDocument();
      expect(screen.queryByText('History')).not.toBeInTheDocument();
      expect(screen.queryByText('Variables')).not.toBeInTheDocument();
    });
  });

  describe('When user is authenticated', () => {
    it('should render welcome back message with username', () => {
      const username = 'testuser';
      renderWithProviders(true, username);

      expect(
        screen.getByText(`Welcome back, ${username}!`)
      ).toBeInTheDocument();
    });

    it('should render welcome back message with empty string when user is null', () => {
      renderWithProviders(true, null);

      expect(screen.getByText('Welcome back, !')).toBeInTheDocument();
    });

    it('should render authenticated user navigation links', () => {
      renderWithProviders(true, 'testuser');

      const restLink = screen.getByText('REST Client');
      expect(restLink).toBeInTheDocument();
      const restAnchor = restLink.closest('a');
      expect(restAnchor).toHaveAttribute('href', '/client/GET');

      const historyLink = screen.getByText('History');
      expect(historyLink).toBeInTheDocument();
      const historyAnchor = historyLink.closest('a');
      expect(historyAnchor).toHaveAttribute('href', '/history');

      const variablesLink = screen.getByText('Variables');
      expect(variablesLink).toBeInTheDocument();
      const variablesAnchor = variablesLink.closest('a');
      expect(variablesAnchor).toHaveAttribute('href', '/variables');
    });

    it('should not render unauthenticated content', () => {
      renderWithProviders(true, 'testuser');

      expect(screen.queryByText('Welcome to the App')).not.toBeInTheDocument();
      expect(screen.queryByText('Sign In')).not.toBeInTheDocument();
      expect(screen.queryByText('Sign Up')).not.toBeInTheDocument();
    });
  });

  describe('Redux state integration', () => {
    it('should respond to changes in authentication state', () => {
      const { rerender } = renderWithProviders(false);

      expect(screen.getByText('Welcome to the App')).toBeInTheDocument();

      const authenticatedStore = createMockStore(true, 'newuser');
      const nextIntlProps: ComponentProps<typeof NextIntlClientProvider> = {
        locale: 'en',
        messages: mockMessages,
        timeZone: 'UTC',
        children: <Main />,
      };

      rerender(
        <Provider store={authenticatedStore}>
          <NextIntlClientProvider {...nextIntlProps} />
        </Provider>
      );

      expect(screen.getByText('Welcome back, newuser!')).toBeInTheDocument();
      expect(screen.queryByText('Welcome to the App')).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper semantic structure', () => {
      renderWithProviders(false);

      const mainElement = screen.getByRole('main');
      expect(mainElement).toBeInTheDocument();

      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toBeInTheDocument();
    });

    it('should have accessible links for unauthenticated users', () => {
      renderWithProviders(false);

      const links = screen.getAllByRole('link');
      expect(links).toHaveLength(2);

      links.forEach((link) => {
        expect(link).toHaveAttribute('href');
        expect(link.textContent).toBeTruthy();
      });
    });

    it('should have accessible navigation for authenticated users', () => {
      renderWithProviders(true, 'testuser');

      const links = screen.getAllByRole('link');
      expect(links).toHaveLength(3);

      links.forEach((link) => {
        expect(link).toHaveAttribute('href');
        expect(link.textContent).toBeTruthy();
      });
    });
  });

  describe('Edge cases', () => {
    it('should handle empty user string gracefully', () => {
      renderWithProviders(true, '');

      expect(screen.getByText('Welcome back, !')).toBeInTheDocument();
    });

    it('should handle null user gracefully', () => {
      renderWithProviders(true, null);

      expect(screen.getByText('Welcome back, !')).toBeInTheDocument();
    });

    it('should handle user with special characters', () => {
      const specialUser = 'user@domain.com';
      renderWithProviders(true, specialUser);

      expect(
        screen.getByText(`Welcome back, ${specialUser}!`)
      ).toBeInTheDocument();
    });

    it('should handle very long usernames', () => {
      const longUser = 'a'.repeat(100);
      renderWithProviders(true, longUser);

      expect(
        screen.getByText(`Welcome back, ${longUser}!`)
      ).toBeInTheDocument();
    });
  });
});
