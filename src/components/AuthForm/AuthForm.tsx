'use client';

import { FC, Fragment } from 'react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { AuthFormData, schemaSignIn, schemaSignUp } from '@utils/validation';
import { ActionResponse, UserAuth } from '@types';
import { loginUser, registerUser } from '@actions/auth-actions';
import { setToastValue } from '@states/toastSlice';
import { signIn } from '@states/uiSlice';
import { useAppDispatch } from '../../hooks/useAppStore';
import { setVariables } from '@states/variablesSlice';
import { loadVariables } from '@services/local-storage.service';

const inputClasses = `border-2 rounded-sm focus:bg-violet-100 transition-all duration-300 px-1`;
const fieldClasses = 'flex w-full justify-start items-center gap-2';
const labelClasses = 'w-[40%] text-right cursor-pointer';
const errorClasses = 'h-3 text-red-500 text-sm text-center';

const getBorderColor = (isError: boolean): string => {
  return isError
    ? 'border-red-700 focus:outline-red-800'
    : 'border-violet-900 focus:outline-violet-900';
};

export const AuthForm: FC<{ isRegistration?: boolean }> = ({
  isRegistration = false,
}) => {
  const t = useTranslations('AuthForm');
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<AuthFormData>({
    resolver: yupResolver(isRegistration ? schemaSignUp(t) : schemaSignIn(t)),
  });
  const dispatch = useAppDispatch();

  const onSubmit = async (data: UserAuth) => {
    let result: ActionResponse;
    if (isRegistration) {
      result = await registerUser(data);
    } else {
      result = await loginUser(data);
    }
    if (result.errorMessage) {
      dispatch(
        setToastValue({
          message: result.errorMessage,
          type: 'error',
        })
      );
    } else {
      dispatch(
        setToastValue({
          message: `Successful ${isRegistration ? 'registration' : 'login'}`,
          type: 'success',
        })
      );
      dispatch(setVariables(loadVariables(data.email)));
      dispatch(signIn(data.email));
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={`rounded-lg flex flex-col justify-center items-center gap-2.5 
      bg-violet-200 shadow-lg shadow-gray-300 text-violet-950 min-h-[30vh]
      min-w-[65vh] py-5`}
    >
      <div className="w-full">
        <div className={fieldClasses}>
          <label className={labelClasses} htmlFor="email">
            {t('email')}
          </label>
          <input
            className={`${inputClasses} ${getBorderColor(errors.email !== undefined)}`}
            id="email"
            type="text"
            {...register('email')}
          />
        </div>
        <p className={errorClasses}>{errors.email?.message}</p>
      </div>
      <div className="w-full">
        <div className={fieldClasses}>
          <label className={labelClasses} htmlFor="password">
            {t('password')}
          </label>
          <input
            className={`${inputClasses} ${getBorderColor(errors.password !== undefined)}`}
            id="password"
            type="password"
            {...register('password')}
            autoComplete="on"
          />
        </div>
        <p className={errorClasses}>{errors.password?.message}</p>
      </div>
      {isRegistration && (
        <Fragment>
          <div className="w-full">
            <div className={fieldClasses}>
              <label className={labelClasses} htmlFor="repeat-password">
                {t('repeat-password')}
              </label>
              <input
                className={`${inputClasses} ${getBorderColor(errors.confirmPassword !== undefined)}`}
                id="repeat-password"
                type="password"
                {...register('confirmPassword')}
                autoComplete="on"
              />
            </div>
            <p className={errorClasses}>{errors.confirmPassword?.message}</p>
          </div>
        </Fragment>
      )}
      <input
        type="submit"
        className={`px-4 py-1 bg-violet-500 text-white rounded 
        hover:bg-violet-600 transition duration-300 cursor-pointer mt-3`}
        value={t(`sign-${isRegistration ? 'up' : 'in'}`)}
      />
    </form>
  );
};
