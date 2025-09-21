'use client';

import { type FC } from 'react';
import { createPortal } from 'react-dom';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '@store/store';
import { clearValue } from '@states/toastSlice';

export interface ToastProps {
  message: string;
  type: 'error' | 'success' | 'info';
}

const Toast: FC<ToastProps> = ({ message, type }) => {
  const dispatch = useDispatch<AppDispatch>();

  const dismiss = () => {
    dispatch(clearValue());
  };

  return createPortal(
    <div
      data-testid="toast"
      className={`fixed flex items-center justify-between bottom-4 right-4 p-3 cursor-pointer
      rounded-lg shadow-lg text-white w-1/4 h-15 z-50 transition-opacity duration-300 ${
        type === 'error'
          ? 'bg-red-400/80'
          : type === 'success'
            ? 'bg-green-600/80'
            : 'bg-blue-600/80'
      }`}
      onClick={dismiss}
    >
      <p>{message}</p>
      <button
        onClick={dismiss}
        className="text-white ml-2 text-xs border-1 px-1 border-white cursor-pointer"
      >
        ×
      </button>
    </div>,
    document.body
  );
};

export default Toast;
