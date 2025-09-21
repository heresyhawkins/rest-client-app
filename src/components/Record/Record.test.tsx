import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { Record } from '@components';
import { userEvent } from '@testing-library/user-event';

const mockSaveHandler = vi.fn();
const mockDeleteHandler = vi.fn();

const renderWithIntl = (name: string, value: string) => {
  render(
    <NextIntlClientProvider
      locale="en"
      messages={{
        VariablesPage: {
          name: 'Name: ',
          value: 'Value: ',
        },
      }}
    >
      <Record
        name={name}
        value={value}
        saveHandlerAction={mockSaveHandler}
        deleteHandlerAction={mockDeleteHandler}
      />
    </NextIntlClientProvider>
  );
};

describe('Record component tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('Should render correctly', () => {
    renderWithIntl('name', 'value');

    expect(screen.getByText(/Name:/)).toBeInTheDocument();
    expect(screen.getByText(/Value:/)).toBeInTheDocument();
    expect(screen.getByDisplayValue(/name/)).toBeInTheDocument();
    expect(screen.getByDisplayValue(/value/)).toBeInTheDocument();
    expect(screen.getByTestId('delete-btn-name')).toBeInTheDocument();
    expect(screen.getByTestId('edit-mode-btn-name')).toBeInTheDocument();
  });

  it('Should render check mark in edit mode', async () => {
    renderWithIntl('name', 'value');
    await userEvent.click(screen.getByTestId('edit-mode-btn-name'));

    expect(screen.getByTestId('accept-btn-name')).toBeInTheDocument();
  });

  it('Should call delete handler after delete button click', async () => {
    renderWithIntl('name', 'value');
    await userEvent.click(screen.getByTestId('delete-btn-name'));

    expect(mockDeleteHandler).toBeCalled();
  });

  it('Should call save handler on name/value change and accept button click', async () => {
    renderWithIntl('name', 'value');
    await userEvent.click(screen.getByTestId('edit-mode-btn-name'));
    await userEvent.type(screen.getByLabelText(/Value:/), 'new');
    await userEvent.type(screen.getByLabelText(/Name:/), 'new');
    await userEvent.click(screen.getByTestId('accept-btn-name'));

    expect(mockSaveHandler).toBeCalled();
  });
});
