'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Briefcase, FileText, Mail, Wrench } from 'lucide-react';
import { StatCard } from '@/components/admin/stat-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { adminApi } from '@/lib/admin-api';
import type { DashboardStats } from '@/lib/types';
import { formatDate } from '@/lib/utils';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.dashboard
      .stats()
      .then((res) => setStats(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Overview of your portfolio content.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Projects" value={stats.totalProjects} icon={Briefcase} />
        <StatCard label="Total Skills" value={stats.totalSkills} icon={Wrench} />
        <StatCard
          label="Blog Posts"
          value={`${stats.publishedPosts}/${stats.totalPosts}`}
          icon={FileText}
        />
        <StatCard label="Unread Messages" value={stats.unreadMessages} icon={Mail} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Messages</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {stats.recentMessages.length === 0 && (
              <p className="text-sm text-muted-foreground">No messages yet.</p>
            )}
            {stats.recentMessages.map((m) => (
              <Link
                key={m.id}
                href="/admin/messages"
                className="flex items-center justify-between rounded-md border border-border px-3 py-2 text-sm hover:border-primary/30"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium">{m.subject}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {m.name} · {m.email}
                  </p>
                </div>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {formatDate(m.createdAt)}
                </span>
              </Link>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Projects</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {stats.recentProjects.length === 0 && (
              <p className="text-sm text-muted-foreground">No projects yet.</p>
            )}
            {stats.recentProjects.map((p) => (
              <Link
                key={p.id}
                href="/admin/projects"
                className="flex items-center justify-between rounded-md border border-border px-3 py-2 text-sm hover:border-primary/30"
              >
                <span className="truncate font-medium">{p.title}</span>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {formatDate(p.createdAt)}
                </span>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
