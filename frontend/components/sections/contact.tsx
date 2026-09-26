import { SectionHeading } from '@/components/sections/section-heading';
import { ContactForm } from '@/components/sections/contact-form';

export function Contact() {
  return (
    <section id="contact" className="scroll-mt-24 border-t border-border py-24">
      <div className="container">
        <SectionHeading
          eyebrow="contact"
          title="Let's build something reliable"
          description="Have a role, project, or bug worth squashing? Send a message."
        />

        <div className="mx-auto mt-14 max-w-2xl rounded-xl border border-border bg-card/50 p-6 sm:p-10">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
