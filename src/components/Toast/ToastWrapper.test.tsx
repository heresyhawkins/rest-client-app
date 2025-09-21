import { describe, expect, it } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { ToastWrapper } from '@components';
import { userEvent } from '@testing-library/user-event';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import toastReducer, { ToastState } from '@states/toastSlice';

const renderWithStore = (preloadedState?: { toast: ToastState }) => {
  const store = configureStore({
    reducer: { toast: toastReducer },
    preloadedState,
  });

  return render(
    <Provider store={store}>
      <ToastWrapper />
    </Provider>
  );
};

describe('ToastWrapper component tests', () => {
  it('Should render Toast if state not null', async () => {
    renderWithStore({
      toast: {
        message: 'Logged out',
        type: 'success',
      },
    });

    expect(await screen.findByText('Logged out')).toBeInTheDocument();
  });

  it('Should close Toast automatically after 3 sec', async () => {
    renderWithStore({
      toast: {
        message: 'Logged out',
        type: 'success',
      },
    });
    const toast = screen.getByText('Logged out');
    expect(toast).toBeInTheDocument();

    await waitFor(() => expect(toast).not.toBeInTheDocument(), {
      timeout: 4000,
    });
  });

  it('Should close Toast on click', async () => {
    renderWithStore({
      toast: {
        message: 'Logged out',
        type: 'success',
      },
    });
    const toast = screen.getByText('Logged out');
    await userEvent.click(toast);
    expect(toast).not.toBeInTheDocument();
  });
});
