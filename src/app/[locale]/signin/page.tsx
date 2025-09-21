import { redirectIfAuthenticated } from '@utils/redirects';
import { AuthForm } from '@components';

export default async function SignInPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  await redirectIfAuthenticated(locale);

  return <AuthForm />;
}
