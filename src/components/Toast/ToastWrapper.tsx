'use client';

import { FC, Fragment, useEffect } from 'react';
import Toast from './Toast';
import { clearValue } from '@states/toastSlice';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppStore';

export const ToastWrapper: FC = () => {
  const toastState = useAppSelector((state) => state.toast);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (toastState) {
        dispatch(clearValue());
      }
    }, 3000);
    return () => clearTimeout(timeout);
  }, [toastState, dispatch]);

  return (
    <Fragment>
      {toastState ? (
        <Toast
          message={toastState.message ?? ''}
          type={toastState.type ?? 'info'}
        />
      ) : undefined}
    </Fragment>
  );
};
