import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Footer } from '@components';
import { TEAM } from '@data/team';
import { NextIntlClientProvider } from 'next-intl';

describe('Footer component tests', () => {
  it('renders correctly', () => {
    render(
      <NextIntlClientProvider
        locale="en"
        messages={{ Footer: { 'developed by': 'developed by' } }}
      >
        <Footer />
      </NextIntlClientProvider>
    );

    const courseLink = screen.getByTestId('react-course-link');

    expect(screen.getByText('2025 © developed by:')).toBeInTheDocument();
    expect(courseLink).toBeInTheDocument();
    expect(courseLink).toHaveAttribute(
      'href',
      'https://rs.school/courses/reactjs'
    );
    Object.entries(TEAM).forEach(([name, githubLink]) => {
      const link = screen.getByTestId(`github-${name}`);

      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', githubLink);
    });
  });
});
