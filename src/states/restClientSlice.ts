import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { APIResponse } from '@types';

export interface RestClientState {
  method: string;
  endpoint: string;
  headers: Record<string, string>;
  body: string;
  isJson: boolean;
  response: APIResponse;
  isLoading: boolean;
}

const initialState: RestClientState = {
  method: 'GET',
  endpoint: '',
  headers: {},
  body: '',
  isJson: true,
  response: {} as APIResponse,
  isLoading: false,
};

const restClientSlice = createSlice({
  name: 'restClient',
  initialState,
  reducers: {
    setMethod: (state, action: PayloadAction<string>) => {
      state.method = action.payload;
    },
    setEndpoint: (state, action: PayloadAction<string>) => {
      state.endpoint = action.payload;
    },
    addHeader: (state, action: PayloadAction<Record<string, string>>) => {
      state.headers = Object.fromEntries([
        ...Object.entries(state.headers),
        ...Object.entries(action.payload),
      ]);
    },
    setHeaders: (state, action: PayloadAction<Record<string, string>>) => {
      state.headers = action.payload;
    },
    setBody: (state, action: PayloadAction<string>) => {
      state.body = action.payload;
    },
    setIsJson: (state, action: PayloadAction<boolean>) => {
      state.isJson = action.payload;
    },
    setResponse: (state, action: PayloadAction<APIResponse>) => {
      state.response = action.payload;
    },
    clearResponse: (state) => {
      state.response = {} as APIResponse;
    },
    clearRequest: () => {
      return { ...initialState };
    },
  },
});

export const {
  setMethod,
  setEndpoint,
  addHeader,
  setHeaders,
  setBody,
  setIsJson,
  setResponse,
  clearResponse,
  clearRequest,
} = restClientSlice.actions;
export default restClientSlice.reducer;
