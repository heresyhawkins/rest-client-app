import { describe, expect, it } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { ButtonCopy } from '@components';
import { userEvent } from '@testing-library/user-event';
import { NextIntlClientProvider } from 'next-intl';

const actionMock = vi.fn();

const renderWithIntl = () =>
  render(
    <NextIntlClientProvider
      locale="en"
      messages={{
        RestClient: {
          copy: 'copy',
        },
      }}
    >
      <ButtonCopy action={actionMock} />
    </NextIntlClientProvider>
  );

describe('ButtonCopy component tests', () => {
  it('Should render correctly', () => {
    renderWithIntl();

    expect(screen.getByRole('button', { name: 'copy' })).toBeInTheDocument();
  });

  it('Should update text and call action on click and change text to original after 1.5s', async () => {
    renderWithIntl();

    const button = screen.getByTestId('button-copy');
    await userEvent.click(button);

    expect(await screen.findByText('✔')).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText('copy')).toBeInTheDocument(), {
      timeout: 2000,
    });
    expect(actionMock).toBeCalled();
  });
});
