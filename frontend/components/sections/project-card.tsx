import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, Github, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { Project } from '@/lib/types';

const CATEGORY_LABELS: Record<string, string> = {
  WEB: 'Web',
  API: 'API',
  MOBILE: 'Mobile',
  TESTING: 'Testing',
  TOOLING: 'Tooling',
  OTHER: 'Other',
};

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card/50 transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-border bg-muted">
        {project.coverImage ? (
          <Image
            src={project.coverImage}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="bg-grid flex h-full w-full items-center justify-center font-mono text-xs text-muted-foreground">
            {project.title}
          </div>
        )}
        <div className="absolute left-3 top-3 flex gap-2">
          <Badge variant="secondary">{CATEGORY_LABELS[project.category] ?? project.category}</Badge>
          {project.featured && (
            <Badge variant="default" className="gap-1">
              <Star className="h-3 w-3 fill-current" /> Featured
            </Badge>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-lg font-semibold leading-snug">{project.title}</h3>
          <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary" />
        </div>
        <p className="line-clamp-2 text-sm text-muted-foreground">{project.summary}</p>

        <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
          {project.technologies.slice(0, 4).map((tech) => (
            <span key={tech} className="rounded-full bg-muted px-2 py-0.5 font-mono text-[11px] text-muted-foreground">
              {tech}
            </span>
          ))}
        </div>

        {project.githubUrl && (
          <div className="flex items-center gap-1 pt-1 text-xs text-muted-foreground">
            <Github className="h-3.5 w-3.5" /> View source
          </div>
        )}
      </div>
    </Link>
  );
}
