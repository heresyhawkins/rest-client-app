import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ResponseViewer } from './ResponseViewer';
import { APIResponse } from '@types';

describe('ResponseViewer', () => {
  it('should display error message when error is present', () => {
    const errorData = {
      status: 500,
      error: 'Something went wrong',
    } as APIResponse;

    render(<ResponseViewer data={errorData} />);

    const errorText = screen.getByText('Something went wrong');
    expect(errorText).toBeInTheDocument();
    expect(errorText.closest('pre')).toHaveClass('text-red-700');
  });

  it('should display formatted JSON response', () => {
    const successData = {
      status: 200,
      data: '{"message": "Success", "id": 123}',
    } as APIResponse;

    render(<ResponseViewer data={successData} />);

    const pre = screen.getByText(/"message": "Success"/);
    expect(pre).toBeInTheDocument();
    expect(pre.closest('pre')).toHaveClass('bg-violet-100');
  });
});
