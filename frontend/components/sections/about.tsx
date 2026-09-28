import { SectionHeading } from '@/components/sections/section-heading';
import { getProfile } from '@/lib/content';

const FOCUS_AREAS = [
  { tag: 'frontend', label: 'Frontend Development', detail: 'React and Next.js interfaces with an eye for accessibility and polish.' },
  { tag: 'backend', label: 'Backend Development', detail: 'REST APIs, relational schema design, authentication & authorization.' },
  { tag: 'qa', label: 'Quality Assurance', detail: 'Manual + automated testing across UI, API, and performance layers.' },
];

export async function About() {
  const profile = await getProfile().catch(() => null);

  const bio =
    profile?.bio ??
    'I am a Computer Science and Engineering graduate who works across the stack: writing test plans and automated suites as a QA engineer, and building backend services and frontend interfaces as a developer.';

  return (
    <section id="about" className="scroll-mt-24 border-t border-border py-24">
      <div className="container">
        <SectionHeading
          eyebrow="about"
          title="Developer mindset, QA discipline"
          description="A quick introduction to how I work and what I focus on."
        />

        <div className="mt-14 grid grid-cols-1 gap-12 lg:grid-cols-[1fr_1fr] lg:items-start">
          <div className="space-y-5 text-lg leading-relaxed text-muted-foreground">
            <p>{bio}</p>
            <p>
              I hold a BSc in Computer Science and Engineering from Adama Science and Technology
              University, where I built a foundation in algorithms, databases, and systems design
              that still shapes how I approach every project today.
            </p>
          </div>

          <div className="space-y-4">
            {FOCUS_AREAS.map((area) => (
              <div
                key={area.tag}
                className="group flex items-start gap-4 rounded-lg border border-border bg-card/50 p-5 transition-colors hover:border-primary/30"
              >
                <span className="mt-0.5 shrink-0 rounded-md bg-primary/10 px-2 py-1 font-mono text-xs text-primary">
                  {area.tag}
                </span>
                <div>
                  <p className="font-medium text-foreground">{area.label}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{area.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
