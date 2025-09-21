import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { AuthForm } from '@components';
import { userEvent } from '@testing-library/user-event';
import { ReduxProvider } from '@store/Providers';

const renderWithIntl = (isRegistration: boolean) => {
  render(
    <NextIntlClientProvider
      locale="en"
      messages={{
        AuthForm: {
          email: 'Email:',
          password: 'Password:',
          'repeat-password': 'Confirm password:',
          'sign-in': 'Sign In',
          'sign-up': 'Sign Up',
          errors: {
            invalidEmail: 'Invalid email',
            requiredEmail: 'Email is required',
            requiredPassword: 'Password is required',
            minPassword: 'Password must be at least length characters',
            lowercasePassword: 'Password must contain a lowercase letter',
            uppercasePassword: 'Password must contain an uppercase letter',
            numberPassword: 'Password must contain a number',
            specialPassword: 'Password must contain a special character',
            requiredConfirm: 'Confirm password',
            matchPasswords: 'Passwords must match',
          },
        },
      }}
    >
      <ReduxProvider>
        <AuthForm isRegistration={isRegistration} />
      </ReduxProvider>
    </NextIntlClientProvider>
  );
};

describe('AuthForm component tests', () => {
  it('Should render correctly Sign Up form', () => {
    renderWithIntl(true);

    expect(screen.getByText('Email:')).toBeInTheDocument();
    expect(screen.getByText('Password:')).toBeInTheDocument();
    expect(screen.getByText('Confirm password:')).toBeInTheDocument();
    expect(screen.getByText('Sign Up')).toBeInTheDocument();
  });

  it('Should render correctly Sign In form', () => {
    renderWithIntl(false);

    expect(screen.getByText('Email:')).toBeInTheDocument();
    expect(screen.getByText('Password:')).toBeInTheDocument();
    expect(screen.getByText('Sign In')).toBeInTheDocument();
  });

  it('Should show validation errors', async () => {
    renderWithIntl(true);

    const emailInput = screen.getByRole('textbox', { name: 'Email:' });
    expect(emailInput).toBeInTheDocument();
    const passwordInput = screen.getByLabelText('Password:');
    expect(passwordInput).toBeInTheDocument();
    const confirmPasswordInput = screen.getByLabelText('Confirm password:');
    expect(confirmPasswordInput).toBeInTheDocument();
    const signUpButton = screen.getByRole('button', { name: 'Sign Up' });

    await userEvent.click(signUpButton);

    expect(await screen.findByText('Email is required')).toBeInTheDocument();
    expect(await screen.findByText('Password is required')).toBeInTheDocument();
    expect(await screen.findByText('Confirm password')).toBeInTheDocument();

    await userEvent.type(emailInput, 'test');
    expect(await screen.findByText('Invalid email')).toBeInTheDocument();

    await userEvent.type(passwordInput, 't');
    expect(
      await screen.findByText('Password must be at least 8 characters')
    ).toBeInTheDocument();

    await userEvent.type(passwordInput, 'password');
    expect(
      await screen.findByText('Password must contain an uppercase letter')
    ).toBeInTheDocument();
    await userEvent.clear(passwordInput);
    await userEvent.type(passwordInput, 'PASSWORD');
    expect(
      await screen.findByText('Password must contain a lowercase letter')
    ).toBeInTheDocument();
    await userEvent.type(passwordInput, 'p');
    expect(
      await screen.findByText('Password must contain a number')
    ).toBeInTheDocument();
    await userEvent.type(passwordInput, '3');
    expect(
      await screen.findByText('Password must contain a special character')
    ).toBeInTheDocument();

    await userEvent.type(confirmPasswordInput, 'password');
    expect(await screen.findByText('Passwords must match')).toBeInTheDocument();
  }, 10000);
});
