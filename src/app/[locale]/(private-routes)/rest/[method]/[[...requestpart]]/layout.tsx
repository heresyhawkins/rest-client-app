import { Fragment, ReactNode } from 'react';
import { methods } from '@data/supported-methods';
import { notFound } from 'next/navigation';

export default async function RestClientLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string; method: string; requestpart?: string[] }>;
}) {
  const { method, requestpart } = await params;

  if (
    (requestpart && requestpart.length > 2) ||
    !Object.keys(methods).includes(method)
  ) {
    notFound();
  }

  return <Fragment>{children}</Fragment>;
}
