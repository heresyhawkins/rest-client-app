import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { Footer, Header, NotFound } from '@components';
import { ReduxProvider } from '@store/Providers';
import { getCookie, isAuthenticated } from '@actions/auth-actions';
import './global.css';
import { LayoutWrapper } from './layoutWrapper';

export const metadata: Metadata = {
  title: '404 - Page Not Found',
  description: 'Page Not Found',
};

export default async function NotFoundPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const userLoggedIn = await isAuthenticated();
  const user = await getCookie('userEmail');
  return (
    <html>
      <body>
        <NextIntlClientProvider>
          <ReduxProvider>
            <LayoutWrapper
              locale={locale}
              user={user}
              isAuthenticated={userLoggedIn}
            >
              <Header locale={locale as 'en' | 'ru'} />
              <NotFound />
              <Footer />
            </LayoutWrapper>
          </ReduxProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
