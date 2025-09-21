import { redirect } from '@i18n/navigation';
import { methods } from '@data/supported-methods';
import { routesList } from '@data/routes-list';

export default async function RestClient({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  redirect({ href: `/${routesList.client}/${methods.GET}`, locale: locale });
}
