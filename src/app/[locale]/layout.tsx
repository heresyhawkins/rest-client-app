import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Footer, Header, ErrorBoundary, FallbackUI } from '@components';
import { NextIntlClientProvider } from 'next-intl';
import { hasLocale } from 'use-intl';
import { routing } from '@i18n/routing';
import { notFound } from 'next/navigation';
import { ReduxProvider } from 'store/Providers';
import '../global.css';
import { ToastWrapper } from '@components';
import { getCookie, isAuthenticated } from '@actions/auth-actions';
import { LayoutWrapper } from '../layoutWrapper';

export const metadata: Metadata = {
  title: 'Yagni Rest Client App',
  description:
    'Rest Client App (Next.js) is an application developed in scope of RS School 2025 Q3 React Course',
};

export default async function RootLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const userLoggedIn = await isAuthenticated();
  const user = await getCookie('userEmail');

  return (
    <html lang={locale}>
      <body className="bg-violet-50">
        <ErrorBoundary fallback={<FallbackUI />}>
          <ReduxProvider>
            <NextIntlClientProvider>
              <LayoutWrapper
                locale={locale}
                user={user}
                isAuthenticated={userLoggedIn}
              >
                <Header locale={locale} />
                <div
                  id="root"
                  className="relative flex items-center justify-center w-full min-h-[calc(100vh-116px)]"
                >
                  {children}
                </div>
                <ToastWrapper />
                <Footer />
              </LayoutWrapper>
            </NextIntlClientProvider>
          </ReduxProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
