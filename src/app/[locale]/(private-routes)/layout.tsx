import { Fragment, ReactNode } from 'react';
import { redirectIfNotAuthenticated } from '@utils/redirects';

export default async function RestClientLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  await redirectIfNotAuthenticated(locale);

  return <Fragment>{children}</Fragment>;
}
