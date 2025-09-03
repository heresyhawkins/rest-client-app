import type {FC, ReactNode} from "react";

export const ExternalLink: FC<{children: ReactNode, href: string}> = ({ children, href }) => {
    return <a className="flex gap-1 items-center" href={href} target="_blank">{children}</a>
};
