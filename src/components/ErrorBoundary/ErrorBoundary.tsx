'use client';

import { Component, type ErrorInfo, type ReactNode } from 'react';

type ErrorBoundaryProps = {
  fallback: ReactNode;
  children: ReactNode | ReactNode[];
};

type ErrorBoundaryState = {
  error: Error | undefined;
};

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { error: undefined };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('Error caught by boundary:', error, info);
  }

  render(): ReactNode {
    if (this.state.error) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}
