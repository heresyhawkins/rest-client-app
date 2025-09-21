import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UiState {
  locale: 'en' | 'ru';
  isAuthenticated: boolean;
  user: string | null;
}

const initialState: UiState = {
  locale: 'en',
  isAuthenticated: false,
  user: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleLocale(state) {
      state.locale = state.locale === 'en' ? 'ru' : 'en';
    },
    setLocale(state, action: PayloadAction<'en' | 'ru'>) {
      state.locale = action.payload;
    },
    signIn(state, action: PayloadAction<string>) {
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    signOut(state) {
      state.isAuthenticated = false;
      state.user = null;
    },
  },
});

export const { toggleLocale, setLocale, signIn, signOut } = uiSlice.actions;
export default uiSlice.reducer;
