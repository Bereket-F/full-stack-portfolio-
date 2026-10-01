import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Download, Github, Linkedin, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HeroPanel } from '@/components/sections/hero-panel';
import { getProfile } from '@/lib/content';

const SOCIAL_ICONS: Record<string, typeof Github> = {
  github: Github,
  linkedin: Linkedin,
};

export async function Hero() {
  const profile = await getProfile().catch(() => null);

  const name = profile?.name ?? 'Bereket Fanose';
  const role = profile?.role ?? 'QA Engineer & Full-Stack Developer';
  const tagline =
    profile?.tagline ??
    'I build reliable digital products and test complex systems from requirements to release.';

  return (
    <section className="bg-grid mask-fade-b relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 right-0 h-[420px] w-[420px] rounded-full bg-primary/20 blur-[120px]"
      />
      <div className="container relative grid min-h-[88vh] grid-cols-1 items-center gap-16 py-24 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="animate-fade-up space-y-7">
          <div className="flex items-center gap-4">
            {profile?.avatarUrl && (
              <div className="glow relative h-20 w-20 shrink-0 overflow-hidden rounded-full border-2 border-primary/40 sm:h-24 sm:w-24">
                <Image
                  src={profile.avatarUrl}
                  alt={name}
                  fill
                  sizes="96px"
                  className="object-cover"
                  priority
                />
              </div>
            )}
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 font-mono text-xs text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-success" />
              open to opportunities
            </div>
          </div>

          <h1 className="font-display text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
            {name}
          </h1>

          <div className="space-y-2">
            <p className="text-gradient font-display text-xl font-medium sm:text-2xl">{role}</p>
            {profile?.location && (
              <p className="inline-flex items-center gap-1.5 font-mono text-sm text-muted-foreground">
                <MapPin className="h-3.5 w-3.5 text-primary" />
                {profile.location}
              </p>
            )}
          </div>

          <p className="max-w-xl text-balance text-base text-muted-foreground sm:text-lg">
            {tagline}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button asChild size="lg">
              <Link href="/projects">
                View Projects <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/#contact">Contact Me</Link>
            </Button>
            {profile?.resumeUrl && (
              <Button asChild size="lg" variant="outline">
                <Link href={profile.resumeUrl} target="_blank" rel="noopener noreferrer">
                  <Download className="h-4 w-4" /> Download CV
                </Link>
              </Button>
            )}
          </div>

          <div className="flex items-center gap-3 pt-4">
            {profile?.socialLinks
              ?.filter((l) => SOCIAL_ICONS[l.platform.toLowerCase()])
              .map((link) => {
                const Icon = SOCIAL_ICONS[link.platform.toLowerCase()];
                return (
                  <Link
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.platform}
                    className="flex h-10 w-10 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
                  >
                    <Icon className="h-4 w-4" />
                  </Link>
                );
              })}
          </div>
        </div>

        <div className="animate-fade-up [animation-delay:150ms]">
          <HeroPanel />
        </div>
      </div>
    </section>
  );
}
