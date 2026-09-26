import type { Metadata } from 'next';
import { AuthProvider } from '@/hooks/use-auth';

export const metadata: Metadata = {
  title: { default: 'Admin', template: '%s — Admin' },
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="dark min-h-screen bg-background text-foreground">
      <AuthProvider>{children}</AuthProvider>
    </div>
  );
}
