import { AuthForm } from '@components';
import { redirectIfAuthenticated } from '@utils/redirects';

export default async function SignUpPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  await redirectIfAuthenticated(locale);

  return (
    <div>
      <AuthForm isRegistration={true} />
    </div>
  );
}
