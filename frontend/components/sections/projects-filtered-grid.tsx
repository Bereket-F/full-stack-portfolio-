'use client';

import { useMemo, useState } from 'react';
import { ProjectCard } from '@/components/sections/project-card';
import { cn } from '@/lib/utils';
import type { Project, ProjectCategory } from '@/lib/types';

const CATEGORY_LABELS: Record<ProjectCategory, string> = {
  WEB: 'Web',
  API: 'API',
  MOBILE: 'Mobile',
  TESTING: 'Testing',
  TOOLING: 'Tooling',
  OTHER: 'Other',
};

export function ProjectsFilteredGrid({ projects }: { projects: Project[] }) {
  const categories = useMemo(() => {
    const present = Array.from(new Set(projects.map((p) => p.category)));
    return present as ProjectCategory[];
  }, [projects]);

  const [active, setActive] = useState<ProjectCategory | 'ALL'>('ALL');

  const visible = active === 'ALL' ? projects : projects.filter((p) => p.category === active);

  return (
    <div>
      <div className="mb-10 flex flex-wrap justify-center gap-2">
        <button
          onClick={() => setActive('ALL')}
          className={cn(
            'rounded-full border px-4 py-1.5 font-mono text-xs transition-colors',
            active === 'ALL' ? 'border-primary/40 bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:text-foreground',
          )}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={cn(
              'rounded-full border px-4 py-1.5 font-mono text-xs transition-colors',
              active === cat ? 'border-primary/40 bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:text-foreground',
            )}
          >
            {CATEGORY_LABELS[cat]}
          </button>
        ))}
      </div>

      {visible.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {visible.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground">No projects in this category yet.</p>
      )}
    </div>
  );
}
