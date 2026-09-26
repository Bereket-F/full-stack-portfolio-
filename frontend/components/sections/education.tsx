import { SectionHeading } from '@/components/sections/section-heading';
import { getEducation } from '@/lib/content';
import { formatMonthYear } from '@/lib/utils';

export async function Education() {
  const education = await getEducation().catch(() => []);

  return (
    <section id="education" className="scroll-mt-24 border-t border-border py-24">
      <div className="container">
        <SectionHeading eyebrow="education" title="Academic background" />

        {education.length > 0 ? (
          <div className="mx-auto mt-14 grid max-w-3xl grid-cols-1 gap-4">
            {education.map((edu) => (
              <div key={edu.id} className="rounded-lg border border-border bg-card/50 p-6">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-display text-lg font-semibold">{edu.institution}</h3>
                  <span className="font-mono text-xs text-muted-foreground">
                    {formatMonthYear(edu.startDate)} — {edu.current ? 'Present' : edu.endDate ? formatMonthYear(edu.endDate) : ''}
                  </span>
                </div>
                <p className="mt-1 text-muted-foreground">
                  {edu.degree}
                  {edu.field ? `, ${edu.field}` : ''}
                </p>
                {edu.description && <p className="mt-3 text-sm text-muted-foreground">{edu.description}</p>}
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-14 text-center text-muted-foreground">
            Education history will appear here once added in the admin dashboard.
          </p>
        )}
      </div>
    </section>
  );
}
