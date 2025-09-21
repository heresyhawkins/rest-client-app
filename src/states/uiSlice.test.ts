import { describe, it, expect } from 'vitest';
import uiReducer, {
  toggleLocale,
  signOut,
  signIn,
  setLocale,
  type UiState,
  type UserData,
} from './uiSlice';

describe('uiSlice reducer', () => {
  const initialState: UiState = {
    locale: 'en',
    isAuthenticated: false,
    user: null,
  };

  it('should return initial state by default', () => {
    expect(uiReducer(undefined, { type: '' })).toEqual(initialState);
  });

  it('should toggle locale from en to ru', () => {
    const state: UiState = { ...initialState, locale: 'en' };
    const newState = uiReducer(state, toggleLocale());

    expect(newState.locale).toBe('ru');
  });

  it('should toggle locale from ru to en', () => {
    const state: UiState = { ...initialState, locale: 'ru' };
    const newState = uiReducer(state, toggleLocale());

    expect(newState.locale).toBe('en');
  });

  it('should set locale explicitly', () => {
    const state: UiState = { ...initialState, locale: 'en' };
    const newState = uiReducer(state, setLocale('ru'));

    expect(newState.locale).toBe('ru');
  });

  it('should sign in user', () => {
    const user: UserData = { uid: '123', email: 'test@example.com' };
    const newState = uiReducer(initialState, signIn(user));

    expect(newState.isAuthenticated).toBe(true);
    expect(newState.user).toEqual(user);
  });

  it('should sign out user', () => {
    const state: UiState = {
      locale: 'en',
      isAuthenticated: true,
      user: { uid: '123', email: 'test@example.com' },
    };
    const newState = uiReducer(state, signOut());

    expect(newState.isAuthenticated).toBe(false);
    expect(newState.user).toBeNull();
  });
});
