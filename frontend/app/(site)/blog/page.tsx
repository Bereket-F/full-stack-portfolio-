import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { SectionHeading } from '@/components/sections/section-heading';
import { Badge } from '@/components/ui/badge';
import { getBlogPosts } from '@/lib/content';
import { formatDate } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Notes on testing, backend development, and building reliable software.',
};

export default async function BlogPage() {
  const posts = await getBlogPosts().catch(() => []);

  return (
    <div className="container py-24">
      <SectionHeading
        eyebrow="blog"
        title="Notes on testing & engineering"
        description="Thoughts on QA, backend systems, and building software that holds up."
      />

      {posts.length > 0 ? (
        <div className="mx-auto mt-14 grid max-w-3xl grid-cols-1 gap-6">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group flex gap-5 rounded-xl border border-border bg-card/50 p-5 transition-colors hover:border-primary/30"
            >
              {post.coverImage && (
                <div className="relative hidden h-24 w-36 shrink-0 overflow-hidden rounded-lg border border-border sm:block">
                  <Image src={post.coverImage} alt={post.title} fill className="object-cover" sizes="144px" />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="font-mono text-xs text-muted-foreground">
                  {post.publishedAt ? formatDate(post.publishedAt) : 'Draft'}
                </p>
                <h2 className="mt-1 font-display text-xl font-semibold group-hover:text-primary">{post.title}</h2>
                {post.excerpt && <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{post.excerpt}</p>}
                {post.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {post.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="mt-14 text-center text-muted-foreground">No articles published yet — check back soon.</p>
      )}
    </div>
  );
}
