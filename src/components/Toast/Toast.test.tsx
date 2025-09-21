import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import Toast from './Toast';
import { ReduxProvider } from '@store/Providers';

const renderWithStore = (
  message: string,
  type: 'error' | 'success' | 'info'
) => {
  render(
    <ReduxProvider>
      <Toast message={message} type={type} />
    </ReduxProvider>
  );
};

describe('Toast component tests', () => {
  it('Should render Toast error', () => {
    renderWithStore('message', 'error');

    const toast = screen.getByTestId('toast');
    expect(toast.className).toContain('bg-red-400/80');
  });

  it('Should render Toast info', () => {
    renderWithStore('message', 'info');

    const toast = screen.getByTestId('toast');
    expect(toast.className).toContain('bg-blue-600/80');
  });
});
