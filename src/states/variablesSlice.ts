import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type VariablesState = {
  value: Record<string, string>;
};

const variablesSlice = createSlice({
  name: 'variables',
  initialState: {} as VariablesState,
  reducers: {
    setVariables: (
      state,
      { payload }: PayloadAction<Record<string, string>>
    ) => {
      state.value = { ...payload };
    },
    clearVariables: (state) => {
      state.value = {};
    },
  },
});

export const { setVariables, clearVariables } = variablesSlice.actions;
export default variablesSlice.reducer;
