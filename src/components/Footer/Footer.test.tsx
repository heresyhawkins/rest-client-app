import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Footer } from "@components";
import { TEAM } from "../../data/team.ts";

describe('Footer component tests', () => {
  it('renders correctly', () => {
    render(<Footer/>);

    const courseLink = screen.getByTestId('react-course-link');

    expect(screen.getByText('2025 © created by:')).toBeInTheDocument();
    expect(courseLink).toBeInTheDocument();
    expect(courseLink).toHaveAttribute('href', 'https://rs.school/courses/reactjs');
    Object.entries(TEAM).forEach(([name, githubLink]) => {
      const link = screen.getByTestId(`github-${name}`);

      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', githubLink);
    })
  });
})