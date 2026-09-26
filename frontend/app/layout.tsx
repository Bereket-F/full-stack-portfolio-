import type { Metadata } from 'next';
import { Inter, JetBrains_Mono, Space_Grotesk } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import './globals.css';

const sans = Inter({ subsets: ['latin'], variable: '--font-sans' });
const display = Space_Grotesk({ subsets: ['latin'], variable: '--font-display' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Bereket Fanose — QA Engineer & Full-Stack Developer',
    template: '%s — Bereket Fanose',
  },
  description:
    'I build reliable digital products and test complex systems from requirements to release.',
  openGraph: {
    title: 'Bereket Fanose — QA Engineer & Full-Stack Developer',
    description:
      'I build reliable digital products and test complex systems from requirements to release.',
    url: siteUrl,
    siteName: 'Bereket Fanose',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bereket Fanose — QA Engineer & Full-Stack Developer',
    description:
      'I build reliable digital products and test complex systems from requirements to release.',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${sans.variable} ${display.variable} ${mono.variable} font-sans`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          {children}
          <Toaster position="bottom-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
