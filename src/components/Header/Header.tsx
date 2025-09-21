'use client';

import { LanguageToggle } from '@components';
import { FC, Fragment } from 'react';
import { useEffect, useState } from 'react';
import { BiCool } from 'react-icons/bi';
import { signOut } from 'states/uiSlice';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { removeAuthCookie } from '@actions/auth-actions';
import { setToastValue } from '@states/toastSlice';
import { routesList } from '@data/routes-list';
import { useRouter } from '@i18n/navigation';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppStore';
import { clearVariables } from '@states/variablesSlice';

export const Header: FC<{ locale: 'en' | 'ru' }> = ({ locale }) => {
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();

  const t = useTranslations('Header');
  const authenticated = useAppSelector((state) => state.ui.isAuthenticated);

  const dispatch = useAppDispatch();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = async () => {
    try {
      await removeAuthCookie();
      dispatch(signOut());
      dispatch(
        setToastValue({
          message: 'Logged out',
          type: 'success',
        })
      );
      dispatch(clearVariables());
    } catch {
      dispatch(
        setToastValue({
          message: 'Something went wrong',
          type: 'error',
        })
      );
    }
    router.push({ pathname: routesList.main }, { locale });
  };

  return (
    <header
      className={`sticky top-0 z-50 flex items-center justify-between px-6 transition-all duration-300 ${
        scrolled ? 'bg-violet-400 h-14 shadow-2xl' : 'bg-violet-300 h-20'
      } text-violet-50`}
    >
      <div className="flex items-center gap-2">
        <Link href="/" aria-label="Go to main page">
          <BiCool
            className={`transition-all duration-300 ${
              scrolled ? 'size-12 text-violet-700' : 'size-14 text-violet-500'
            }`}
          />
        </Link>
        <LanguageToggle />
      </div>

      <nav>
        <ul className="flex gap-4 items-center">
          {authenticated ? (
            <Fragment>
              <li>
                <Link
                  href={`/${locale}/${routesList.main}`}
                  className="px-3 py-1 rounded bg-violet-600 hover:bg-violet-500 transition text-lg"
                >
                  {t('main')}
                </Link>
              </li>
              <li>
                <button
                  onClick={handleSignOut}
                  className="px-3 py-1 rounded bg-violet-600 hover:bg-violet-500 transition"
                >
                  {t('signout')}
                </button>
              </li>
            </Fragment>
          ) : (
            <Fragment>
              <li>
                <Link
                  href={`/${locale}/${routesList.login}`}
                  className="px-3 py-1 rounded bg-violet-600 hover:bg-violet-500 transition text-lg"
                >
                  {t('signin')}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/${routesList.register}`}
                  className="px-3 py-1 rounded bg-violet-600 hover:bg-violet-500 transition text-lg"
                >
                  {t('signup')}
                </Link>
              </li>
            </Fragment>
          )}
        </ul>
      </nav>
    </header>
  );
};
