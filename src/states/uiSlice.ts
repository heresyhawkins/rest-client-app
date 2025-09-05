import { createSlice } from "@reduxjs/toolkit";

interface localeState {
  locale: "en" | "ru";
  isAuthenticated: boolean;
}

const initialState: localeState = {
  locale: "en",
  isAuthenticated: true,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleLocale(state) {
      state.locale = state.locale === "en" ? "ru" : "en";
    },
    signOut(state) {
      state.isAuthenticated = false;
    },
  },
});

export const { toggleLocale, signOut } = uiSlice.actions;
export default uiSlice.reducer;