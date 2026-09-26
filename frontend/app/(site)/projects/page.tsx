import type { Metadata } from 'next';
import { SectionHeading } from '@/components/sections/section-heading';
import { ProjectsFilteredGrid } from '@/components/sections/projects-filtered-grid';
import { getProjects } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Projects',
  description: 'A selection of QA tooling, backend services, and full-stack projects.',
};

export default async function ProjectsPage() {
  const projects = await getProjects().catch(() => []);

  return (
    <div className="container py-24">
      <SectionHeading
        eyebrow="all projects"
        title="Things I've built and tested"
        description="Filter by category to explore backend services, tooling, and full-stack apps."
      />
      <div className="mt-14">
        <ProjectsFilteredGrid projects={projects} />
      </div>
    </div>
  );
}
