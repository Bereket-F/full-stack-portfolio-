import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/layout/navbar';

export default function NotFound() {
  return (
    <>
      <Navbar />
      <div className="container flex min-h-[80vh] flex-col items-center justify-center pt-16 text-center">
        <p className="font-mono text-sm text-primary">404</p>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
          Route not found
        </h1>
        <p className="mt-4 max-w-md text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist, was moved, or never shipped past code review.
        </p>
        <Button asChild size="lg" className="mt-8">
          <Link href="/">Back to home</Link>
        </Button>
      </div>
    </>
  );
}
