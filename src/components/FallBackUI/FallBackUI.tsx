'use client';

import type { FC } from 'react';

export const FallbackUI: FC<{ onReset?: () => void }> = ({ onReset }) => {
  return (
    <div className="max-w-2xl mx-auto p-6 mt-8 border-2 border-red-500 rounded-lg bg-red-50 text-red-800 shadow-md text-center">
      <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
      <p className="mb-6 font-mono leading-relaxed">
        The application encountered an error and cannot continue.
      </p>
      <button
        onClick={onReset || (() => window.location.reload())}
        className="px-5 py-2 bg-red-700 text-white rounded-md hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
      >
        Reload
      </button>
    </div>
  );
};
