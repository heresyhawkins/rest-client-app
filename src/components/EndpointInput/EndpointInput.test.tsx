import { render, screen, fireEvent } from '@testing-library/react';
import { EndpointInput } from '@components';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const messages: Record<string, string> = {
      error: 'Please enter a valid URL',
    };
    return messages[key] || key;
  },
}));

describe('EndpointInput', () => {
  const onChange = vi.fn();

  beforeEach(() => {
    onChange.mockClear();
  });

  it('renders input with placeholder', () => {
    render(<EndpointInput value="" onChange={onChange} isValid={true} />);

    const input = screen.getByPlaceholderText('https://api.example.com/users');
    expect(input).toBeInTheDocument();
  });

  it('calls onChange on input change', () => {
    render(<EndpointInput value="" onChange={onChange} isValid={true} />);

    const input = screen.getByPlaceholderText('https://api.example.com/users');
    fireEvent.change(input, { target: { value: 'https://test.com' } });

    expect(onChange).toHaveBeenCalledWith('https://test.com');
  });

  it('displays current value', () => {
    render(
      <EndpointInput
        value="https://my-api.com/data"
        onChange={onChange}
        isValid={true}
      />
    );

    const input = screen.getByDisplayValue('https://my-api.com/data');
    expect(input).toBeInTheDocument();
  });

  it('shows green border for valid URL', () => {
    render(
      <EndpointInput
        value="https://example.com"
        onChange={onChange}
        isValid={true}
      />
    );

    const input = screen.getByDisplayValue('https://example.com');
    expect(input).toHaveClass('border-green-500');
  });

  it('has no error and gray border when empty', () => {
    render(<EndpointInput value="" onChange={onChange} isValid={true} />);

    const input = screen.getByPlaceholderText('https://api.example.com/users');
    expect(input).toHaveClass('border-gray-300');

    const error = screen.queryByText('Please enter a valid URL');
    expect(error).not.toBeInTheDocument();
  });
});
