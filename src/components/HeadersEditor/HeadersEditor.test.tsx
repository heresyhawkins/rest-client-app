import { render, screen, fireEvent } from '@testing-library/react';
import { HeadersEditor } from '@components';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const messages: Record<string, string> = {
      button: 'Add',
    };
    return messages[key] || key;
  },
}));

describe('HeadersEditor', () => {
  const onAdd = vi.fn();

  beforeEach(() => {
    onAdd.mockClear();
  });

  it('renders key-value inputs and Add button', () => {
    render(<HeadersEditor headers={{}} onAdd={onAdd} />);

    expect(screen.getByPlaceholderText('Key')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Value')).toBeInTheDocument();
    expect(screen.getByText('Add')).toBeInTheDocument();
  });

  it('calls onAdd with key and value when Add is clicked', () => {
    render(<HeadersEditor headers={{}} onAdd={onAdd} />);

    fireEvent.change(screen.getByPlaceholderText('Key'), {
      target: { value: 'Authorization' },
    });
    fireEvent.change(screen.getByPlaceholderText('Value'), {
      target: { value: 'Bearer token' },
    });
    fireEvent.click(screen.getByText('Add'));

    expect(onAdd).toHaveBeenCalledWith('Authorization', 'Bearer token');
  });

  it('does not call onAdd if key or value is empty', () => {
    render(<HeadersEditor headers={{}} onAdd={onAdd} />);

    fireEvent.change(screen.getByPlaceholderText('Key'), {
      target: { value: '' },
    });
    fireEvent.change(screen.getByPlaceholderText('Value'), {
      target: { value: 'value' },
    });
    fireEvent.click(screen.getByText('Add'));

    expect(onAdd).not.toHaveBeenCalled();
  });

  it('displays added headers in list', () => {
    render(
      <HeadersEditor
        headers={{ 'Content-Type': 'application/json' }}
        onAdd={onAdd}
      />
    );

    expect(screen.getByText('Content-Type')).toBeInTheDocument();
    expect(screen.getByText('application/json')).toBeInTheDocument();
  });

  it('clears input fields after adding header', () => {
    render(<HeadersEditor headers={{}} onAdd={onAdd} />);

    const keyInput = screen.getByPlaceholderText('Key');
    const valueInput = screen.getByPlaceholderText('Value');

    fireEvent.change(keyInput, { target: { value: 'X-API-Key' } });
    fireEvent.change(valueInput, { target: { value: 'abc123' } });
    fireEvent.click(screen.getByText('Add'));

    expect(keyInput).toHaveValue('');
    expect(valueInput).toHaveValue('');
  });
});
