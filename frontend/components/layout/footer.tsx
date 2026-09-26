import Link from 'next/link';
import { Github, Linkedin, Mail, Twitter } from 'lucide-react';
import { getProfile } from '@/lib/content';

const ICONS: Record<string, typeof Github> = {
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter,
};

export async function Footer() {
  const profile = await getProfile().catch(() => null);
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border">
      <div className="container flex flex-col gap-6 py-10 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <p className="font-mono text-sm text-muted-foreground">
            <span className="text-primary">$</span> echo &quot;built by {profile?.name ?? 'Bereket Fanose'}&quot;
          </p>
          <p className="text-xs text-muted-foreground">
            &copy; {year} {profile?.name ?? 'Bereket Fanose'}. All rights reserved.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {profile?.socialLinks?.map((link) => {
            const Icon = ICONS[link.platform.toLowerCase()] ?? Mail;
            return (
              <Link
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.platform}
                className="flex h-9 w-9 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
              >
                <Icon className="h-4 w-4" />
              </Link>
            );
          })}
          {profile?.email && (
            <Link
              href={`mailto:${profile.email}`}
              aria-label="Email"
              className="flex h-9 w-9 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
            >
              <Mail className="h-4 w-4" />
            </Link>
          )}
        </div>
      </div>
    </footer>
  );
}
