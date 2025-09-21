import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ErrorBoundary } from '@components';

const FallbackUI = <div data-testid="fallback">Something went wrong.</div>;

const ThrowingComponent = () => {
  throw new Error('Test error');
};

console.error = vi.fn();

describe('ErrorBoundary', () => {
  it('should render children by default', () => {
    render(
      <ErrorBoundary fallback={FallbackUI}>
        <div>Hello World</div>
      </ErrorBoundary>
    );

    expect(screen.getByText('Hello World')).toBeInTheDocument();
    expect(screen.queryByTestId('fallback')).not.toBeInTheDocument();
  });

  it('should catch an error and render fallback UI', () => {
    render(
      <ErrorBoundary fallback={FallbackUI}>
        <ThrowingComponent />
      </ErrorBoundary>
    );

    expect(screen.getByTestId('fallback')).toBeInTheDocument();
    expect(console.error).toHaveBeenCalled();
  });

  it('should pass error to componentDidCatch', () => {
    const spy = vi.spyOn(console, 'error');
    render(
      <ErrorBoundary fallback={FallbackUI}>
        <ThrowingComponent />
      </ErrorBoundary>
    );

    expect(spy).toHaveBeenCalledWith(
      'Error caught by boundary:',
      expect.any(Error),
      expect.any(Object)
    );
  });
});
