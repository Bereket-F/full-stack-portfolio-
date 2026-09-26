import { SectionHeading } from '@/components/sections/section-heading';
import { SkillsGrid } from '@/components/sections/skills-grid';
import { getSkills } from '@/lib/content';

export async function Skills() {
  const skills = await getSkills().catch(() => []);

  return (
    <section id="skills" className="scroll-mt-24 border-t border-border py-24">
      <div className="container">
        <SectionHeading
          eyebrow="skills"
          title="Tools I use to ship and verify software"
          description="Managed from the admin dashboard — grouped by discipline."
        />
        <div className="mt-14">
          <SkillsGrid skills={skills} />
        </div>
      </div>
    </section>
  );
}
