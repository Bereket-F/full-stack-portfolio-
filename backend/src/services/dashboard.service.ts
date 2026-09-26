import { prisma } from '@/lib/prisma';

export async function getDashboardStats() {
  const [
    totalProjects,
    totalSkills,
    totalPosts,
    publishedPosts,
    unreadMessages,
    recentMessages,
    recentProjects,
  ] = await Promise.all([
    prisma.project.count(),
    prisma.skill.count(),
    prisma.blogPost.count(),
    prisma.blogPost.count({ where: { status: 'PUBLISHED' } }),
    prisma.message.count({ where: { read: false, archived: false } }),
    prisma.message.findMany({ orderBy: { createdAt: 'desc' }, take: 5 }),
    prisma.project.findMany({ orderBy: { createdAt: 'desc' }, take: 5 }),
  ]);

  return {
    totalProjects,
    totalSkills,
    totalPosts,
    publishedPosts,
    unreadMessages,
    recentMessages,
    recentProjects,
  };
}
