import { describe, it, expect, beforeEach, Mock } from 'vitest';
import { render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { Variables } from '@components';
import { userEvent } from '@testing-library/user-event';
import { configureStore } from '@reduxjs/toolkit';
import variablesReducer from '@states/variablesSlice';
import uiReducer from '@states/uiSlice';
import { Provider } from 'react-redux';
import * as lcService from '@services/local-storage.service';

const variablesState = {
  name1: 'val1',
  name2: 'val2',
  name3: 'val3',
};

vi.mock('@services/local-storage.service');

const renderWithIntlAndStore = (preloadedState: Record<string, string>) => {
  const store = configureStore({
    reducer: {
      ui: uiReducer,
      variables: variablesReducer,
    },
    preloadedState: {
      ui: {
        locale: 'en' as 'en' | 'ru',
        isAuthenticated: false,
        user: 'test@test.test',
      },
      variables: {
        value: preloadedState,
      },
    },
  });
  render(
    <NextIntlClientProvider
      locale="en"
      messages={{
        VariablesPage: {
          name: 'Name: ',
          value: 'Value: ',
          add: 'Add',
        },
      }}
    >
      <Provider store={store}>
        <Variables />
      </Provider>
    </NextIntlClientProvider>
  );

  return store;
};

describe('Variables component tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('Should render correctly', () => {
    const state = {
      ...variablesState,
    };
    (lcService.loadVariables as Mock).mockReturnValue(state);
    renderWithIntlAndStore(state);

    expect(screen.getByRole('button', { name: 'Add' })).toBeInTheDocument();
    Object.entries(state).forEach(([key, value]) => {
      expect(screen.getByDisplayValue(key)).toBeInTheDocument();
      expect(screen.getByDisplayValue(value)).toBeInTheDocument();
    });
  });

  it('Should add variable correctly', async () => {
    (lcService.loadVariables as Mock).mockReturnValue(variablesState);
    const store = renderWithIntlAndStore(variablesState);

    const addNameInput = screen.getAllByLabelText(/Name:/)[0];
    const addValueInput = screen.getAllByLabelText(/Value:/)[0];

    await userEvent.type(addNameInput, 'name4');
    await userEvent.type(addValueInput, 'value4');
    await userEvent.click(screen.getByRole('button', { name: 'Add' }));

    expect(addNameInput.textContent).toBe('');
    expect(addValueInput.textContent).toBe('');
    expect(store.getState().variables.value).toEqual({
      ...variablesState,
      name4: 'value4',
    });
  });

  it('Should delete variable correctly', async () => {
    (lcService.loadVariables as Mock).mockReturnValue(variablesState);
    const store = renderWithIntlAndStore(variablesState);

    const removeButton = screen.getByTestId('delete-btn-name1');

    await userEvent.click(removeButton);

    expect(store.getState().variables.value).toEqual(
      Object.fromEntries(
        Object.entries(variablesState).filter(([key]) => key != 'name1')
      )
    );
  });

  it('Should update variable correctly', async () => {
    (lcService.loadVariables as Mock).mockReturnValue(variablesState);
    const store = renderWithIntlAndStore(variablesState);

    const editButton = screen.getByTestId('edit-mode-btn-name1');
    await userEvent.click(editButton);
    const editNameInput = screen.getAllByLabelText(/Name:/)[1];
    const editValueInput = screen.getAllByLabelText(/Value:/)[1];
    await userEvent.clear(editNameInput);
    await userEvent.type(editNameInput, 'name4');
    await userEvent.clear(editValueInput);
    await userEvent.type(editValueInput, 'value4');
    await userEvent.click(screen.getByTestId('accept-btn-name1'));

    expect(store.getState().variables.value).toEqual({
      ...Object.fromEntries(
        Object.entries(variablesState).filter(([key]) => key != 'name1')
      ),
      name4: 'value4',
    });
  });
});
