import { Card } from "@/components/ui/Card";
import { SanctuaryPageHeader } from "@/components/sanctuary/SanctuaryPageHeader";
import type { ReactNode } from "react";

export const metadata = {
  title: "Privacy Policy — Apostolic Power Network",
  description: "How Apostolic Power Network collects, uses, and protects information.",
};

const CONTACT_EMAIL = "apostolicpowernet@gmail.com";
const EFFECTIVE_DATE = "July 17, 2026";

export default function PrivacyPage() {
  return (
    <div className="container-app py-10 sm:py-12">
      <SanctuaryPageHeader
        eyebrow="Your information"
        title="Privacy Policy"
        subtitle="A clear explanation of the limited information APN collects and how it is used."
        imageIndex={3}
      />

      <Card hover={false} className="mx-auto max-w-4xl p-6 sm:p-10">
        <p className="text-sm text-sanctuary-soft">Effective date: {EFFECTIVE_DATE}</p>
        <p className="mt-5 leading-relaxed text-sanctuary-muted">
          Apostolic Power Network (&ldquo;APN,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) is a curated discovery site for
          Apostolic sermons, podcasts, events, and resources. This policy explains what information
          we collect when you use APN, why we use it, and the choices available to you.
        </p>

        <PolicySection title="Information you choose to provide">
          <p>
            If you join the APN newsletter, we collect your email address so we can send the updates
            you requested. If you suggest content, we collect the name, email address, content type,
            original link, and message you submit so we can review and respond to that suggestion.
          </p>
          <p className="mt-3">
            Please do not submit sensitive personal information through the newsletter or suggestion
            forms.
          </p>
        </PolicySection>

        <PolicySection title="How we use information">
          <ul className="list-disc space-y-2 pl-5">
            <li>To deliver newsletter updates that you requested.</li>
            <li>To review, respond to, and follow up on content suggestions.</li>
            <li>To operate, secure, and improve APN.</li>
            <li>To comply with applicable law or protect APN and its visitors.</li>
          </ul>
          <p className="mt-3">APN does not sell personal information.</p>
        </PolicySection>

        <PolicySection title="Service providers and third-party content">
          <p>
            APN uses Formspree to receive newsletter and suggestion-form submissions. Formspree
            processes the information you submit under its own privacy policy. You can read that
            policy at{" "}
            <a
              href="https://formspree.io/legal/privacy-policy/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-sanctuary-link hover:text-sanctuary-linkhover hover:underline"
            >
              Formspree&apos;s Privacy Policy
            </a>.
          </p>
          <p className="mt-3">
            APN also links to and may embed material from third parties, including YouTube and Spotify.
            When you play embedded media, open an external resource, or load externally hosted images,
            those providers may collect information under their own terms and privacy policies. APN
            does not control those third parties.
          </p>
        </PolicySection>

        <PolicySection title="Cookies and similar technologies">
          <p>
            APN does not intentionally use its own analytics or advertising cookies in this launch
            release. Third-party media, links, and form services may use cookies or similar
            technologies according to their own policies. You can manage many cookies through your
            browser settings.
          </p>
        </PolicySection>

        <PolicySection title="Retention and security">
          <p>
            We keep newsletter and suggestion information only for as long as reasonably necessary to
            provide the requested service, manage the APN collection, meet legal obligations, or
            resolve issues. No online service can guarantee absolute security, but we take reasonable
            steps to limit access to the information we receive.
          </p>
        </PolicySection>

        <PolicySection title="Your choices and requests">
          <p>
            You may ask us to access, correct, or delete personal information you submitted to APN, or
            to stop sending newsletter updates. Email{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}?subject=APN%20Privacy%20Request`}
              className="font-semibold text-sanctuary-link hover:text-sanctuary-linkhover hover:underline"
            >
              {CONTACT_EMAIL}
            </a>{" "}
            with your request. We may need to verify that a request relates to your information before
            acting on it.
          </p>
        </PolicySection>

        <PolicySection title="Children's privacy">
          <p>
            APN is not directed to children under 13, and we do not knowingly collect personal
            information from children under 13. If you believe a child has provided information to
            APN, please contact us so we can address the request.
          </p>
        </PolicySection>

        <PolicySection title="Changes to this policy">
          <p>
            We may update this policy as APN grows or our practices change. The effective date at the
            top of this page shows when it was last updated.
          </p>
        </PolicySection>

        <PolicySection title="Contact">
          <p>
            Questions about this policy can be sent to{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}?subject=APN%20Privacy%20Question`}
              className="font-semibold text-sanctuary-link hover:text-sanctuary-linkhover hover:underline"
            >
              {CONTACT_EMAIL}
            </a>.
          </p>
        </PolicySection>
      </Card>
    </div>
  );
}

function PolicySection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-t border-sanctuary-line pt-7 first:mt-7">
      <h2 className="font-serif text-2xl font-medium text-sanctuary-ink">{title}</h2>
      <div className="mt-3 text-[15px] leading-relaxed text-sanctuary-muted">{children}</div>
    </section>
  );
}
