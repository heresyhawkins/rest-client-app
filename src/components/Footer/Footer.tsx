import type { FC } from "react";
import logo from "../../../assets/rss-logo.svg";
import githubLogo from "../../../assets/github-mark.svg";
import { TEAM } from "../../data/team.ts";
import { ExternalLink, Logo } from "@components";

export const Footer: FC = () => {
  return (
    <footer className="flex justify-center gap-2.5 bg-violet-300 p-1.5 text-violet-950">
      <ExternalLink href={"https://rs.school/courses/reactjs"}>
        <Logo src={logo} alt={"RS School logo"} />
      </ExternalLink>
      <span>2025 © created by:</span>
      <ul className="flex gap-2.5">
        {Object.entries(TEAM).map(([name, github]) => (
          <li key={name}>
            <ExternalLink href={github}>
              <span>{name}</span>
              <Logo src={githubLogo} alt="GitHub logo" />
            </ExternalLink>
          </li>
        ))}
      </ul>
    </footer>
  );
};
