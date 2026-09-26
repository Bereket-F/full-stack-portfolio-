'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Briefcase,
  FileText,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Mail,
  Settings,
  Share2,
  Sparkles,
  User,
  Wrench,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';

const NAV_SECTIONS = [
  {
    label: null,
    items: [{ href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard }],
  },
  {
    label: 'Content',
    items: [
      { href: '/admin/profile', label: 'Profile', icon: User },
      { href: '/admin/projects', label: 'Projects', icon: Briefcase },
      { href: '/admin/skills', label: 'Skills', icon: Wrench },
      { href: '/admin/experience', label: 'Experience', icon: Sparkles },
      { href: '/admin/education', label: 'Education', icon: GraduationCap },
      { href: '/admin/blog', label: 'Blog', icon: FileText },
    ],
  },
  {
    label: 'Communication',
    items: [{ href: '/admin/messages', label: 'Messages', icon: Mail }],
  },
  {
    label: 'Settings',
    items: [
      { href: '/admin/settings/general', label: 'General', icon: Settings },
      { href: '/admin/settings/social', label: 'Social Links', icon: Share2 },
      { href: '/admin/settings/seo', label: 'SEO', icon: FileText },
    ],
  },
];

export function AdminSidebar({ className }: { className?: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, user } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.replace('/admin/login');
  };

  return (
    <aside
      className={cn('flex w-64 shrink-0 flex-col border-r border-border bg-card/40', className)}
    >
      <div className="flex h-16 items-center border-b border-border px-6 font-mono text-sm">
        <span className="text-primary">$</span>&nbsp;admin
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-6">
        {NAV_SECTIONS.map((section, i) => (
          <div key={i}>
            {section.label && (
              <p className="mb-2 px-3 font-mono text-xs uppercase tracking-wider text-muted-foreground">
                {section.label}
              </p>
            )}
            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const active = pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                      active
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-border p-4">
        <p className="truncate px-3 text-xs text-muted-foreground">{user?.email}</p>
        <button
          onClick={handleLogout}
          className="mt-1 flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
        >
          <LogOut className="h-4 w-4" /> Logout
        </button>
      </div>
    </aside>
  );
}
