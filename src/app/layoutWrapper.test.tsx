import { describe, it, expect, vi } from 'vitest';
import { LayoutWrapper } from './layoutWrapper';
import { render, screen } from '@testing-library/react';
import { ReduxProvider } from '@store/Providers';
import { setLocale, signIn, signOut } from '@states/uiSlice';

const mockDispatch = vi.fn();

vi.mock('../hooks/useAppStore', () => ({
  useAppDispatch: () => mockDispatch,
}));

describe('LayoutWrapper component tests', () => {
  beforeEach(() => {
    mockDispatch.mockClear();
  });

  it('Should render correctly', () => {
    render(
      <ReduxProvider>
        <LayoutWrapper locale="en" isAuthenticated={true} user="test@test.test">
          <div>Children</div>
        </LayoutWrapper>
      </ReduxProvider>
    );

    expect(screen.getByText('Children')).toBeInTheDocument();
  });

  it('Should dispatch setLocale and signIn when authenticated', () => {
    render(
      <ReduxProvider>
        <LayoutWrapper locale="en" isAuthenticated={true} user="test@test.test">
          <div>Children</div>
        </LayoutWrapper>
      </ReduxProvider>
    );

    expect(mockDispatch).toHaveBeenCalledWith(setLocale('en'));
    expect(mockDispatch).toHaveBeenCalledWith(signIn('test@test.test'));
    expect(mockDispatch).not.toHaveBeenCalledWith(signOut());
  });

  it('Should dispatch setLocale and signOut when not authenticated', () => {
    render(
      <ReduxProvider>
        <LayoutWrapper locale="en" isAuthenticated={false}>
          <div>Children</div>
        </LayoutWrapper>
      </ReduxProvider>
    );

    expect(mockDispatch).toHaveBeenCalledWith(setLocale('en'));
    expect(mockDispatch).toHaveBeenCalledWith(signOut());
    expect(mockDispatch).not.toHaveBeenCalledWith(signIn(expect.anything()));
  });
});
