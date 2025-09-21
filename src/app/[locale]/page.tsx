import { redirect } from '@i18n/navigation';
import { routesList } from '@data/routes-list';

export default async function RootPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  redirect({ href: `/${routesList.main}`, locale: locale });
}
