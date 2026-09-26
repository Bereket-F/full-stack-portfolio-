import type { MetadataRoute } from 'next';
import { getBlogPosts, getProjects } from '@/lib/content';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

  const [projects, posts] = await Promise.all([
    getProjects().catch(() => []),
    getBlogPosts().catch(() => []),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = ['', '/projects', '/blog'].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
  }));

  const projectRoutes: MetadataRoute.Sitemap = projects.map((p) => ({
    url: `${siteUrl}/projects/${p.slug}`,
    lastModified: p.updatedAt,
  }));

  const postRoutes: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${siteUrl}/blog/${p.slug}`,
    lastModified: p.updatedAt,
  }));

  return [...staticRoutes, ...projectRoutes, ...postRoutes];
}
