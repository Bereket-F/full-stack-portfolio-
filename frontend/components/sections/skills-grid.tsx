'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { Skill, SkillCategory } from '@/lib/types';

const CATEGORY_LABELS: Record<SkillCategory, string> = {
  FRONTEND: 'Frontend',
  BACKEND: 'Backend',
  DATABASE: 'Database',
  TESTING: 'Testing',
  DESIGN: 'Design',
  OTHER: 'Other',
};

const CATEGORY_ORDER: SkillCategory[] = ['FRONTEND', 'BACKEND', 'DATABASE', 'TESTING', 'DESIGN', 'OTHER'];

function ProficiencyBar({ level }: { level: number }) {
  const filled = Math.round(level / 20);
  return (
    <div className="flex gap-0.5" aria-hidden>
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={cn('h-1 w-4 rounded-full', i < filled ? 'bg-primary' : 'bg-muted')}
        />
      ))}
    </div>
  );
}

export function SkillsGrid({ skills }: { skills: Skill[] }) {
  const categories = useMemo(() => {
    const present = new Set(skills.map((s) => s.category));
    return CATEGORY_ORDER.filter((c) => present.has(c));
  }, [skills]);

  const [active, setActive] = useState<SkillCategory | undefined>(categories[0]);
  const currentCategory = active && categories.includes(active) ? active : categories[0];

  if (skills.length === 0) {
    return <p className="text-center text-muted-foreground">Skills will appear here once added in the admin dashboard.</p>;
  }

  const visible = skills.filter((s) => s.category === currentCategory).sort((a, b) => a.order - b.order);

  return (
    <div>
      <div className="mb-8 flex flex-wrap justify-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={cn(
              'rounded-full border px-4 py-1.5 font-mono text-xs transition-colors',
              currentCategory === cat
                ? 'border-primary/40 bg-primary/10 text-primary'
                : 'border-border text-muted-foreground hover:text-foreground',
            )}
          >
            {CATEGORY_LABELS[cat]}
          </button>
        ))}
      </div>

      <div className="mx-auto grid max-w-3xl grid-cols-1 gap-3 sm:grid-cols-2">
        {visible.map((skill, i) => (
          <motion.div
            key={skill.id}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.04 }}
            className="flex items-center justify-between rounded-lg border border-border bg-card/50 px-4 py-3"
          >
            <span className="text-sm font-medium">{skill.name}</span>
            <ProficiencyBar level={skill.level} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
