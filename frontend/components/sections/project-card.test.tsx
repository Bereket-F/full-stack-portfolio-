import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProjectCard } from '@/components/sections/project-card';
import type { Project } from '@/lib/types';

const project: Project = {
  id: '1',
  title: 'Test Project',
  slug: 'test-project',
  summary: 'A project used for testing.',
  overview: null,
  problem: null,
  solution: null,
  role: null,
  challenges: null,
  features: [],
  coverImage: null,
  screenshots: [],
  githubUrl: 'https://github.com/example/test-project',
  demoUrl: null,
  category: 'WEB',
  featured: true,
  published: true,
  order: 0,
  technologies: ['React', 'TypeScript'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

describe('ProjectCard', () => {
  it('renders the title, summary, and technologies', () => {
    render(<ProjectCard project={project} />);
    expect(screen.getByRole('heading', { name: 'Test Project' })).toBeInTheDocument();
    expect(screen.getByText('A project used for testing.')).toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('Featured')).toBeInTheDocument();
  });

  it('links to the project detail page', () => {
    render(<ProjectCard project={project} />);
    expect(screen.getByRole('link')).toHaveAttribute('href', '/projects/test-project');
  });
});
