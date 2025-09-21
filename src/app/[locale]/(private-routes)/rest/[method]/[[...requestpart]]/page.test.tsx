import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import RestDynamicPage from './page';

vi.mock('../../../../../../components/RestClient/RestClient', () => ({
  RestClient: () => <div data-testid="rest-client">Mock RestClient</div>,
}));

describe('RestDynamicPage', () => {
  it('renders loading fallback initially', async () => {
    render(await RestDynamicPage());

    expect(screen.getByText('Loading REST client...')).toBeInTheDocument();
  });

  it('renders RestClient after dynamic import resolves', async () => {
    render(await RestDynamicPage());

    await waitFor(() =>
      expect(screen.getByTestId('rest-client')).toBeInTheDocument()
    );
  });
});
