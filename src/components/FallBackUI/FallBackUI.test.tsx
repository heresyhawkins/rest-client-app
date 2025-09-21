import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FallbackUI } from './FallBackUI';

describe('FallbackUI', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders title, message and button', () => {
    render(<FallbackUI />);

    expect(
      screen.getByRole('heading', { name: /something went wrong/i })
    ).toBeInTheDocument();

    expect(
      screen.getByText(/the application encountered an error/i)
    ).toBeInTheDocument();

    expect(screen.getByRole('button', { name: /reload/i })).toBeInTheDocument();
  });

  it('calls custom onReset when provided', () => {
    const onReset = vi.fn();
    render(<FallbackUI onReset={onReset} />);

    fireEvent.click(screen.getByRole('button', { name: /reload/i }));

    expect(onReset).toHaveBeenCalledTimes(1);
  });

  it('calls window.location.reload when no onReset provided', () => {
    const reloadMock = vi.fn();
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { ...window.location, reload: reloadMock },
    });

    render(<FallbackUI />);

    fireEvent.click(screen.getByRole('button', { name: /reload/i }));

    expect(reloadMock).toHaveBeenCalledTimes(1);
  });
});
