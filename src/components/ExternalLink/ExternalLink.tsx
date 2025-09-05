import type { AnchorHTMLAttributes, FC, ReactNode } from "react";

type ExternalLinkProps = {
  children: ReactNode;
  href: string;
} & AnchorHTMLAttributes<HTMLAnchorElement>;

export const ExternalLink: FC<ExternalLinkProps> = ({ children, href, ...props }) => {
  return <a className="flex gap-1 items-center" href={href} target="_blank" {...props}>{children}</a>
};
