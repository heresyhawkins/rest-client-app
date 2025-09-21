'use client';

import { useRouter, usePathname } from '@i18n/navigation';
import { useLocale } from 'next-intl';

export const LanguageToggle = () => {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  const handleToggle = () => {
    const newLocale = locale === 'en' ? 'ru' : 'en';
    router.push({ pathname }, { locale: newLocale });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div data-testid="language-toggle" className="flex items-center gap-3">
      <button
        onClick={handleToggle}
        className="relative flex h-6 w-12 items-center rounded-full p-1 transition bg-violet-500"
      >
        <span
          className={`h-4 w-4 rounded-full cursor-pointer bg-white shadow-md transform transition ${
            locale === 'en' ? 'translate-x-0' : 'translate-x-6'
          }`}
        />
      </button>

      <div className="flex gap-1 text-sm font-medium">
        <span
          className={`transition ${
            locale === 'en' ? 'text-violet-700 font-bold' : 'text-gray-400'
          }`}
        >
          EN
        </span>
        <span className="text-gray-400">|</span>
        <span
          className={`transition ${
            locale === 'ru' ? 'text-violet-700 font-bold' : 'text-gray-400'
          }`}
        >
          RU
        </span>
      </div>
    </div>
  );
};
