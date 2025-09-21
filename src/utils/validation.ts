import * as yup from 'yup';
import { InferType } from 'yup';

const MIN_PASSWORD_LENGTH = 8;

export const schemaSignIn = (t: (key: string) => string) =>
  yup.object({
    email: yup
      .string()
      .email(t('errors.invalidEmail'))
      .required(t('errors.requiredEmail')),
    password: yup
      .string()
      .required(t('errors.requiredPassword'))
      .min(
        MIN_PASSWORD_LENGTH,
        t('errors.minPassword').replace(
          'length',
          MIN_PASSWORD_LENGTH.toString()
        )
      )
      .matches(/[a-zа-я]/, t('errors.lowercasePassword'))
      .matches(/[A-ZА-Я]/, t('errors.uppercasePassword'))
      .matches(/[0-9]/, t('errors.numberPassword'))
      .matches(/[!@#$%^&*]/, t('errors.specialPassword')),
  });

export const schemaSignUp = (t: (key: string) => string) =>
  schemaSignIn(t).shape({
    confirmPassword: yup
      .string()
      .oneOf([yup.ref('password')], t('errors.matchPasswords'))
      .required(t('errors.requiredConfirm')),
  });

export const schemaAuth = (t: (key: string) => string) =>
  schemaSignIn(t).shape({
    confirmPassword: yup.string().notRequired(),
  });

export type AuthFormData = InferType<ReturnType<typeof schemaAuth>>;
