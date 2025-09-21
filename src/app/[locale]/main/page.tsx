'use client';

import { useSelector } from 'react-redux';
import type { RootState } from 'store/store';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { routesList } from '@data/routes-list';
import { methods } from '@data/supported-methods';

export default function Main() {
  const t = useTranslations('MainPage');

  const isAuthenticated = useSelector(
    (state: RootState) => state.ui.isAuthenticated
  );
  const user = useSelector((state: RootState) => state.ui.user);

  return (
    <main className="flex flex-col items-center justify-center py-10">
      <div className="max-w-xl w-full text-center text-violet-950 bg-violet-200 rounded-xl shadow-lg p-10">
        {!isAuthenticated ? (
          <>
            <h1 className="text-2xl font-bold mb-6">{t('welcome')}</h1>
            <div className="flex gap-4 justify-center">
              <Link
                href={`/${routesList.login}`}
                className="px-4 py-2 bg-violet-500 text-white rounded hover:bg-violet-600 transition"
              >
                {t('signin')}
              </Link>
              <Link
                href={`/${routesList.register}`}
                className="px-4 py-2 bg-violet-500 text-white rounded hover:bg-violet-600 transition"
              >
                {t('signup')}
              </Link>
            </div>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold mb-6">
              {t('welcomeBack', { user: user ?? '' })}
            </h1>
            <div className="flex gap-4 justify-center">
              <Link
                href={`/${routesList.client}/${methods.GET}`}
                className="px-4 py-2 bg-violet-500 text-white rounded hover:bg-violet-600 transition"
              >
                {t('rest')}
              </Link>
              <Link
                href={`/${routesList.history}`}
                className="px-4 py-2 bg-violet-500 text-white rounded hover:bg-violet-600 transition"
              >
                {t('history')}
              </Link>
              <Link
                href={`/${routesList.variables}`}
                className="px-4 py-2 bg-violet-500 text-white rounded hover:bg-violet-600 transition"
              >
                {t('variables')}
              </Link>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
