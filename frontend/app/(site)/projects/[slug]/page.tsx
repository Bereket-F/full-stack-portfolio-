import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ExternalLink, Github } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { getProjectBySlug, getProjects } from '@/lib/content';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const projects = await getProjects().catch(() => []);
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: 'Project not found' };

  return {
    title: project.title,
    description: project.summary,
    openGraph: {
      title: project.title,
      description: project.summary,
      images: project.coverImage ? [project.coverImage] : undefined,
    },
  };
}

const CATEGORY_LABELS: Record<string, string> = {
  WEB: 'Web',
  API: 'API',
  MOBILE: 'Mobile',
  TESTING: 'Testing',
  TOOLING: 'Tooling',
  OTHER: 'Other',
};

function DetailBlock({ title, content }: { title: string; content?: string | null }) {
  if (!content) return null;
  return (
    <div>
      <h2 className="font-display text-xl font-semibold">{title}</h2>
      <p className="mt-3 leading-relaxed text-muted-foreground">{content}</p>
    </div>
  );
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  return (
    <article className="container max-w-4xl py-24">
      <Link href="/projects" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to projects
      </Link>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <Badge>{CATEGORY_LABELS[project.category] ?? project.category}</Badge>
        {project.featured && <Badge variant="accent">Featured</Badge>}
      </div>

      <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight sm:text-5xl">{project.title}</h1>
      <p className="mt-4 max-w-2xl text-lg text-muted-foreground">{project.summary}</p>

      <div className="mt-6 flex flex-wrap gap-3">
        {project.githubUrl && (
          <Button asChild variant="outline">
            <Link href={project.githubUrl} target="_blank" rel="noopener noreferrer">
              <Github className="h-4 w-4" /> Source
            </Link>
          </Button>
        )}
        {project.demoUrl && (
          <Button asChild>
            <Link href={project.demoUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4" /> Live demo
            </Link>
          </Button>
        )}
      </div>

      {project.coverImage && (
        <div className="relative mt-10 aspect-[16/9] w-full overflow-hidden rounded-xl border border-border">
          <Image src={project.coverImage} alt={project.title} fill className="object-cover" sizes="100vw" priority />
        </div>
      )}

      <Separator className="my-10" />

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_260px]">
        <div className="space-y-8">
          <DetailBlock title="Overview" content={project.overview} />
          <DetailBlock title="The Problem" content={project.problem} />
          <DetailBlock title="The Solution" content={project.solution} />
          <DetailBlock title="Challenges" content={project.challenges} />

          {project.features.length > 0 && (
            <div>
              <h2 className="font-display text-xl font-semibold">Key Features</h2>
              <ul className="mt-3 list-inside list-disc space-y-1.5 text-muted-foreground">
                {project.features.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
            </div>
          )}

          {project.screenshots.length > 0 && (
            <div>
              <h2 className="font-display text-xl font-semibold">Screenshots</h2>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {project.screenshots.map((src, i) => (
                  <div key={i} className="relative aspect-video overflow-hidden rounded-lg border border-border">
                    <Image src={src} alt={`${project.title} screenshot ${i + 1}`} fill className="object-cover" sizes="50vw" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <aside className="space-y-6">
          {project.role && (
            <div>
              <h3 className="font-mono text-xs uppercase tracking-wide text-muted-foreground">My Role</h3>
              <p className="mt-1.5 text-sm">{project.role}</p>
            </div>
          )}
          <div>
            <h3 className="font-mono text-xs uppercase tracking-wide text-muted-foreground">Technologies</h3>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {project.technologies.map((tech) => (
                <Badge key={tech} variant="secondary">
                  {tech}
                </Badge>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </article>
  );
}
