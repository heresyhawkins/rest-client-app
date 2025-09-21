'use client';

import { ReactNode, useEffect } from 'react';
import { useAppDispatch } from '../hooks/useAppStore';
import { setLocale, signIn, signOut } from '@states/uiSlice';
import { usePathname } from '@i18n/navigation';
import { routesList } from '@data/routes-list';
import { clearRequest } from '@states/restClientSlice';

export function LayoutWrapper({
  locale,
  isAuthenticated,
  children,
  user,
}: {
  locale: string;
  isAuthenticated: boolean;
  children: ReactNode;
  user?: string;
}) {
  const dispatch = useAppDispatch();
  const path = usePathname();

  useEffect(() => {
    dispatch(setLocale(locale as 'en' | 'ru'));
    if (isAuthenticated && user) {
      dispatch(signIn(user));
    } else {
      dispatch(signOut());
    }
    if (!path.startsWith(`/${routesList.client}`)) {
      dispatch(clearRequest());
    }
  });

  return children;
}
