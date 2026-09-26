import { SectionHeading } from '@/components/sections/section-heading';
import { Skeleton } from '@/components/ui/skeleton';

export default function LoadingBlog() {
  return (
    <div className="container py-24">
      <SectionHeading eyebrow="blog" title="Notes on testing & engineering" />
      <div className="mx-auto mt-14 grid max-w-3xl grid-cols-1 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 w-full rounded-xl" />
        ))}
      </div>
    </div>
  );
}
