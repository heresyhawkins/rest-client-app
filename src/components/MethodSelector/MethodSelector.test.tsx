import { render, screen, fireEvent } from '@testing-library/react';
import { MethodSelector } from 'components';
import { NextIntlClientProvider } from 'next-intl';

const renderWithIntl = (onChange: () => void, method: string = 'GET') => {
  render(
    <NextIntlClientProvider
      locale="en"
      messages={{
        RestClient: {
          method: 'Method',
        },
      }}
    >
      <MethodSelector value={method} onChange={onChange} />
    </NextIntlClientProvider>
  );
};

describe('MethodSelector', () => {
  const onChange = vi.fn();

  beforeEach(() => {
    onChange.mockClear();
  });

  it('renders all HTTP methods', () => {
    renderWithIntl(onChange);

    expect(screen.getByText('GET')).toBeInTheDocument();
    expect(screen.getByText('POST')).toBeInTheDocument();
    expect(screen.getByText('PUT')).toBeInTheDocument();
    expect(screen.getByText('DELETE')).toBeInTheDocument();
    expect(screen.getByText('PATCH')).toBeInTheDocument();
  });

  it('calls onChange when a method is clicked', () => {
    renderWithIntl(onChange);

    fireEvent.click(screen.getByText('POST'));
    expect(onChange).toHaveBeenCalledWith('POST');
  });

  it('highlights the selected method', () => {
    renderWithIntl(onChange, 'POST');

    const postButton = screen.getByText('POST').closest('button');
    expect(postButton).toHaveClass('bg-violet-500');
  });
});
