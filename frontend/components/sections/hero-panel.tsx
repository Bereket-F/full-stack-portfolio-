'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

const TERMINAL_LINES = [
  { text: '$ npm run test', color: 'text-muted-foreground' },
  { text: '✓ auth.spec.ts', suffix: '(6 passed)', color: 'text-success' },
  { text: '✓ projects.spec.ts', suffix: '(9 passed)', color: 'text-success' },
  { text: '✓ contact-form.e2e.ts', suffix: '(4 passed)', color: 'text-success' },
  { text: '', color: '' },
  { text: 'Test Suites: 3 passed, 3 total', color: 'text-muted-foreground' },
  { text: 'Tests: 19 passed, 19 total', color: 'text-muted-foreground' },
];

function TerminalPanel() {
  return (
    <div className="space-y-1.5 font-mono text-[13px] leading-relaxed">
      {TERMINAL_LINES.map((line, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 + i * 0.12, duration: 0.4 }}
          className={line.color}
        >
          {line.text} {line.suffix && <span className="text-muted-foreground">{line.suffix}</span>}
        </motion.div>
      ))}
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="caret-blink inline-block text-primary"
      />
    </div>
  );
}

function ApiPanel() {
  return (
    <div className="space-y-3 font-mono text-[13px] leading-relaxed">
      <div>
        <span className="rounded bg-primary/15 px-1.5 py-0.5 text-primary">GET</span>{' '}
        <span className="text-foreground">/api/projects</span>
      </div>
      <pre className="overflow-x-auto rounded-md bg-muted/60 p-3 text-muted-foreground">
{`{
  "data": [
    {
      "title": "QA Automation Framework",
      "category": "TESTING",
      "featured": true
    }
  ]
}`}
      </pre>
      <div>
        <span className="rounded bg-success/15 px-1.5 py-0.5 text-success">200</span>{' '}
        <span className="text-muted-foreground">OK · 42ms</span>
      </div>
    </div>
  );
}

function SchemaPanel() {
  const tables = [
    { name: 'Project', rel: 'N—N Technology' },
    { name: 'BlogPost', rel: 'N—N BlogTag' },
    { name: 'Experience', rel: '1—N (owned)' },
    { name: 'Message', rel: 'contact submissions' },
  ];
  return (
    <div className="space-y-2 font-mono text-[13px]">
      {tables.map((t, i) => (
        <motion.div
          key={t.name}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="flex items-center justify-between rounded-md border border-border bg-muted/40 px-3 py-2"
        >
          <span className="text-foreground">{t.name}</span>
          <span className="text-muted-foreground">{t.rel}</span>
        </motion.div>
      ))}
    </div>
  );
}

export function HeroPanel() {
  const [tab, setTab] = useState('terminal');

  return (
    <div className="glow relative overflow-hidden rounded-xl border border-border bg-card/80 backdrop-blur">
      <div className="flex items-center gap-1.5 border-b border-border px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-destructive/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-success/70" />
        <span className="ml-3 font-mono text-xs text-muted-foreground">system.status</span>
      </div>

      <div className="p-5">
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="mb-4 grid w-full grid-cols-3">
            <TabsTrigger value="terminal">Terminal</TabsTrigger>
            <TabsTrigger value="api">API</TabsTrigger>
            <TabsTrigger value="schema">Schema</TabsTrigger>
          </TabsList>
          <TabsContent value="terminal" className="min-h-[190px]">
            <TerminalPanel />
          </TabsContent>
          <TabsContent value="api" className="min-h-[190px]">
            <ApiPanel />
          </TabsContent>
          <TabsContent value="schema" className="min-h-[190px]">
            <SchemaPanel />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
