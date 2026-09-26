import { SectionHeading } from '@/components/sections/section-heading';
import { Badge } from '@/components/ui/badge';
import { getExperiences } from '@/lib/content';
import { formatMonthYear } from '@/lib/utils';

export async function Experience() {
  const experiences = await getExperiences().catch(() => []);

  return (
    <section id="experience" className="scroll-mt-24 border-t border-border py-24">
      <div className="container">
        <SectionHeading
          eyebrow="experience"
          title="Where I've worked"
          description="A timeline of roles across QA and full-stack development."
        />

        {experiences.length > 0 ? (
          <div className="relative mx-auto mt-16 max-w-3xl">
            <div className="absolute bottom-0 left-[7px] top-0 w-px bg-border sm:left-[9px]" aria-hidden />
            <div className="space-y-12">
              {experiences.map((exp) => (
                <div key={exp.id} className="relative pl-8 sm:pl-10">
                  <span className="absolute left-0 top-1.5 h-4 w-4 rounded-full border-2 border-primary bg-background sm:h-5 sm:w-5" />

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <h3 className="font-display text-lg font-semibold">{exp.position}</h3>
                    <span className="text-muted-foreground">· {exp.company}</span>
                  </div>

                  <p className="mt-1 font-mono text-xs text-muted-foreground">
                    {formatMonthYear(exp.startDate)} — {exp.current ? 'Present' : exp.endDate ? formatMonthYear(exp.endDate) : ''}
                    {exp.location ? ` · ${exp.location}` : ''}
                  </p>

                  <p className="mt-3 text-muted-foreground">{exp.description}</p>

                  {exp.responsibilities.length > 0 && (
                    <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-muted-foreground">
                      {exp.responsibilities.map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  )}

                  {exp.technologies.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {exp.technologies.map((tech) => (
                        <Badge key={tech} variant="secondary">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="mt-14 text-center text-muted-foreground">
            Experience history will appear here once added in the admin dashboard.
          </p>
        )}
      </div>
    </section>
  );
}
