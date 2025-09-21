'use client';

import { FC, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

export const ButtonCopy: FC<{ action: () => void }> = ({ action }) => {
  const [copied, setCopied] = useState(false);
  const t = useTranslations('RestClient');

  const handleClick = () => {
    setCopied(true);
    action();
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (copied) {
        setCopied(false);
      }
    }, 1500);
    return () => clearTimeout(timeout);
  }, [copied]);

  return (
    <button
      data-testid="button-copy"
      onClick={handleClick}
      className={`px-3 py-1 rounded transition duration-300 text-white border-1 w-30 cursor-pointer
      ${copied ? 'bg-green-100 hover:bg-green-200 border-green-700' : 'bg-violet-600 border-violet-600 hover:bg-violet-500'}`}
    >
      {copied ? '✔' : t('copy')}
    </button>
  );
};
