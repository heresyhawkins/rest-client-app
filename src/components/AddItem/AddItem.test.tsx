import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { AddItem } from '@components';
import { userEvent } from '@testing-library/user-event';

const mockAddHandler = vi.fn();

const renderWithIntl = () => {
  render(
    <NextIntlClientProvider
      locale="en"
      messages={{
        VariablesPage: {
          name: 'Name: ',
          value: 'Value: ',
          add: 'Add',
        },
      }}
    >
      <AddItem addHandlerAction={mockAddHandler} />
    </NextIntlClientProvider>
  );
};

describe('AddItem component tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('Should render correctly', () => {
    renderWithIntl();

    expect(screen.getByText(/Name:/)).toBeInTheDocument();
    expect(screen.getByText(/Value:/)).toBeInTheDocument();
    expect(screen.getByText('Add')).toBeInTheDocument();
  });

  it('Should not call add handler if there is no value in any input', async () => {
    renderWithIntl();

    const nameInput = screen.getByLabelText(/Name:/);
    const valueInput = screen.getByLabelText(/Value:/);
    const addButton = screen.getByRole('button', { name: 'Add' });
    await userEvent.click(addButton);

    expect(mockAddHandler).not.toBeCalled();

    await userEvent.type(nameInput, 'name');
    await userEvent.click(addButton);

    expect(mockAddHandler).not.toBeCalled();

    await userEvent.clear(nameInput);
    await userEvent.type(valueInput, 'value');
    await userEvent.click(addButton);

    expect(mockAddHandler).not.toBeCalled();
  });

  it('Should call add handler if name and value are provided', async () => {
    renderWithIntl();

    const nameInput = screen.getByLabelText(/Name:/);
    const valueInput = screen.getByLabelText(/Value:/);
    const addButton = screen.getByRole('button', { name: 'Add' });

    await userEvent.type(nameInput, 'name');
    await userEvent.type(valueInput, 'value');
    await userEvent.click(addButton);

    expect(mockAddHandler).toBeCalled();
  });
});
