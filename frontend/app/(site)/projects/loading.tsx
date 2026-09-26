import { SectionHeading } from '@/components/sections/section-heading';
import { Skeleton } from '@/components/ui/skeleton';

export default function LoadingProjects() {
  return (
    <div className="container py-24">
      <SectionHeading eyebrow="all projects" title="Things I've built and tested" />
      <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="aspect-[4/5] w-full rounded-xl" />
        ))}
      </div>
    </div>
  );
}
