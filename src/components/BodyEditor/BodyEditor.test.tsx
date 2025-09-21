import { render, screen, fireEvent } from '@testing-library/react';
import { BodyEditor } from '@components';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const messages: Record<string, string> = {
      text: 'Enter request body...',
      textButton: 'Text',
      prettify: 'Prettify',
    };
    return messages[key] || key;
  },
}));

describe('BodyEditor', () => {
  const onChange = vi.fn();
  const onModeChange = vi.fn();

  beforeEach(() => {
    onChange.mockClear();
    onModeChange.mockClear();
  });

  it('renders textarea with placeholder', () => {
    render(
      <BodyEditor
        value=""
        onChange={onChange}
        isJson={true}
        onModeChange={onModeChange}
      />
    );

    const textarea = screen.getByPlaceholderText('Enter request body...');
    expect(textarea).toBeInTheDocument();
  });

  it('calls onChange on textarea input', () => {
    render(
      <BodyEditor
        value=""
        onChange={onChange}
        isJson={true}
        onModeChange={onModeChange}
      />
    );

    const textarea = screen.getByPlaceholderText('Enter request body...');
    fireEvent.change(textarea, { target: { value: '{ "test": true }' } });

    expect(onChange).toHaveBeenCalledWith('{ "test": true }');
  });

  it('displays JSON and Text mode buttons', () => {
    render(
      <BodyEditor
        value=""
        onChange={onChange}
        isJson={true}
        onModeChange={onModeChange}
      />
    );

    expect(screen.getByText('JSON')).toBeInTheDocument();
    expect(screen.getByText('Text')).toBeInTheDocument();
  });

  it('switches mode when clicking JSON/Text button', () => {
    render(
      <BodyEditor
        value=""
        onChange={onChange}
        isJson={true}
        onModeChange={onModeChange}
      />
    );

    fireEvent.click(screen.getByText('Text'));
    expect(onModeChange).toHaveBeenCalledWith(false);

    fireEvent.click(screen.getByText('JSON'));
    expect(onModeChange).toHaveBeenCalledWith(true);
  });

  it('formats valid JSON on Prettify click', () => {
    const mockOnChange = vi.fn();
    render(
      <BodyEditor
        value='{ "name":"John","age":30 }'
        onChange={mockOnChange}
        isJson={true}
        onModeChange={onModeChange}
      />
    );

    fireEvent.click(screen.getByText('Prettify'));
    expect(mockOnChange).toHaveBeenCalledWith(
      '{\n  "name": "John",\n  "age": 30\n}'
    );
  });

  it('shows error when prettifying empty body', () => {
    render(
      <BodyEditor
        value=""
        onChange={onChange}
        isJson={true}
        onModeChange={onModeChange}
      />
    );

    fireEvent.click(screen.getByText('Prettify'));
    expect(screen.getByText('Body is empty')).toBeInTheDocument();
  });

  it('does not validate or show errors in Text mode', () => {
    render(
      <BodyEditor
        value="This is plain text with { brackets }"
        onChange={onChange}
        isJson={false}
        onModeChange={onModeChange}
      />
    );

    fireEvent.click(screen.getByText('Prettify'));
    expect(screen.queryByText('Invalid JSON format')).not.toBeInTheDocument();
  });
});
