import { FC } from 'react';
import { useTranslations } from 'next-intl';

export const NotFound: FC = () => {
  const t = useTranslations('NotFoundPage');
  return (
    <div className="flex items-center justify-center w-full min-h-[calc(100vh-116px)] bg-violet-50">
      {t('text')}
    </div>
  );
};
