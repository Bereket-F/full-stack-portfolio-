import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SectionHeading } from '@/components/sections/section-heading';
import { ProjectCard } from '@/components/sections/project-card';
import { getProjects } from '@/lib/content';

export async function FeaturedProjects() {
  const projects = await getProjects({ featured: true }).catch(() => []);
  const display = projects.slice(0, 3);

  return (
    <section id="projects" className="scroll-mt-24 border-t border-border py-24">
      <div className="container">
        <SectionHeading
          eyebrow="projects"
          title="Selected work"
          description="A mix of QA tooling, backend services, and full-stack applications."
        />

        {display.length > 0 ? (
          <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {display.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <p className="mt-14 text-center text-muted-foreground">
            Projects will appear here once added in the admin dashboard.
          </p>
        )}

        <div className="mt-12 flex justify-center">
          <Button asChild variant="outline" size="lg">
            <Link href="/projects">
              View all projects <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
