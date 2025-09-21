import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { NotFound } from './NotFound';

const notFoundMessage =
  "Oops! It looks like the page you requested wasn't found! Please use the header links to navigate to one of the existing pages.";

describe('NotFound component tests', () => {
  it('Should render correctly', () => {
    render(
      <NextIntlClientProvider
        locale="en"
        messages={{
          NotFoundPage: {
            text: notFoundMessage,
          },
        }}
      >
        <NotFound />
      </NextIntlClientProvider>
    );

    expect(screen.getByText(notFoundMessage)).toBeInTheDocument();
  });
});
