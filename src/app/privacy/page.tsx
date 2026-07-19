import { Card } from "@/components/ui/Card";
import { SanctuaryPageHeader } from "@/components/sanctuary/SanctuaryPageHeader";
import type { ReactNode } from "react";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Privacy Policy",
  description: "How Apostolic Power Network handles launch-list and content-suggestion information.",
  path: "/privacy/",
});

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
            If you suggest content, we collect the name, email address, content type, original link,
            and message you submit so we can review and respond to that suggestion.
          </p>
          <p className="mt-3">
            The APN launch-list form asks only for an email address. Formspree records the email
            address and submission timestamp. APN does not ask for a name or other personal details
            for the launch list. A hidden honeypot rejects automated submissions, and Formspree may
            process minimal technical and anti-spam data associated with a submission.
          </p>
          <p className="mt-3">Please do not submit sensitive personal information through the suggestion form.</p>
        </PolicySection>

        <PolicySection title="How we use information">
          <ul className="list-disc space-y-2 pl-5">
            <li>To review, respond to, and follow up on content suggestions.</li>
            <li>To receive launch-list requests and, if APN later sends curated updates, to use the submitted email only for those updates.</li>
            <li>To prevent fraud and spam, secure the forms, and respond to unsubscribe or privacy requests.</li>
            <li>To comply with applicable law or protect APN and its visitors.</li>
          </ul>
          <p className="mt-3">APN does not sell email addresses or use them for unrelated marketing.</p>
        </PolicySection>

        <PolicySection title="Launch-list email provider">
          <p>
            APN uses Formspree to receive and store launch-list requests. The current form sends the
            submitted email address to APN through Formspree; it does not send an automated
            subscription-confirmation email or create a separate marketing profile.
          </p>
          <p className="mt-3">
            Before APN sends any recurring launch-list updates, it will configure an email provider
            with an unsubscribe method and update this policy to identify that provider and the
            applicable confirmation process.
          </p>
        </PolicySection>

        <PolicySection title="Service providers and third-party content">
          <p>
            Netlify hosts APN. Formspree receives launch-list and content-suggestion submissions.
            These providers process information under their own policies: {" "}
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
            APN displays externally hosted images from UPCI and Unsplash, and links to or may embed
            material from YouTube and Spotify. When you load an externally hosted image, play embedded
            media, or open an external resource, those providers may process information under their
            own terms and privacy policies. APN does not control those third parties.
          </p>
        </PolicySection>

        <PolicySection title="Cookies and similar technologies">
          <p>
            APN does not use its own analytics or advertising cookies in this release. Formspree may
            use cookies or similar technologies when its form service processes a submission. Other
            third-party media and image providers may do the same when their content is loaded. You can
            manage many cookies through your browser settings.
          </p>
        </PolicySection>

        <PolicySection title="Retention and security">
          <p>
            We keep suggestion information only for as long as reasonably necessary to review it,
            respond, manage the APN collection, meet legal obligations, or resolve issues. We do not
            set a fixed retention period for form submissions or security logs; they are kept only as
            long as those purposes require and as the relevant provider retains them under its settings.
          </p>
          <p className="mt-3">
            Formspree retains launch-list submissions under its account and settings. APN does not set
            a separate fixed retention period for launch-list requests. If you ask APN to delete your
            information, APN will delete the applicable Formspree submission where available and may
            retain the minimum information necessary to honor a future opt-out request. No online
            service can guarantee absolute security, but we take reasonable steps to limit access to
            the information we receive.
          </p>
        </PolicySection>

        <PolicySection title="Your choices and requests">
          <p>
            You may ask us to access, correct, or delete personal information you submitted to APN, or
            to stop further follow-up about a suggestion or launch-list request. If APN later sends
            launch-list updates, each message will include an unsubscribe method. Email{" "}
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
            top of this page shows when it was last updated. This policy describes the current
            implementation and should receive legal review if APN&apos;s audience, data collection, or
            jurisdictions expand.
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
