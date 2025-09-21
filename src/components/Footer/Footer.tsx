import type { FC } from 'react';
import logo from '@assets/rss-logo.svg';
import githubLogo from '@assets/github-mark.svg';
import { TEAM } from '@data/team';
import { ExternalLink, Logo } from '@components';
import { useTranslations } from 'next-intl';

export const Footer: FC = () => {
  const t = useTranslations('Footer');
  return (
    <footer className="flex justify-center gap-2.5 bg-violet-300 p-1.5 text-violet-950">
      <ExternalLink
        data-testid="react-course-link"
        href={'https://rs.school/courses/reactjs'}
      >
        <Logo src={logo} alt={'RS School logo'} />
      </ExternalLink>
      <span>{`2025 © ${t('developed by')}:`}</span>
      <ul className="flex gap-2.5">
        {Object.entries(TEAM).map(([name, github]) => (
          <li key={name}>
            <ExternalLink href={github} data-testid={`github-${name}`}>
              <span>{name}</span>
              <Logo src={githubLogo} alt="GitHub logo" />
            </ExternalLink>
          </li>
        ))}
      </ul>
    </footer>
  );
};
