import { createFileRoute, Link } from "@tanstack/react-router";
import logoAsset from "@/assets/win-logo-mark.png.asset.json";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/privacy")({
  component: Privacy,
  head: () => ({
    meta: [
      { title: "Privacy Policy — WIN Legal Advisors" },
      {
        name: "description",
        content:
          "How WIN Legal Advisors collects, uses, and protects personal information — DPDP-aligned data practices, cookies, retention, and your rights.",
      },
      { property: "og:title", content: "Privacy Policy — WIN Legal Advisors" },
      { property: "og:description", content: "Privacy Policy for winlegaladvisors.com." },
      { property: "og:url", content: "https://www.winlegaladvisors.com/privacy" },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "WIN Legal Advisors" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "Privacy Policy — WIN Legal Advisors" },
      { name: "twitter:description", content: "Privacy Policy for winlegaladvisors.com." },
    ],
    links: [{ rel: "canonical", href: "https://www.winlegaladvisors.com/privacy" }],
  }),
});

function Privacy() {
  const updated = "22 July 2026";
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-navy/10 bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link to="/"><img src={logoAsset.url} alt="WIN Legal Advisors" className="h-10 w-auto" /></Link>
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-navy hover:text-gold">
            <ArrowLeft className="h-4 w-4" /> Back to home
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-16">
        <span className="text-xs font-semibold uppercase tracking-[0.32em] text-gold">Legal</span>
        <h1 className="mt-4 font-serif text-4xl font-bold text-navy-deep md:text-5xl">Privacy Policy</h1>
        <p className="mt-3 text-sm text-muted-foreground">Last updated: {updated}</p>

        <div className="prose prose-slate mt-10 max-w-none text-navy-soft [&_h2]:font-serif [&_h2]:text-navy-deep [&_h2]:text-2xl [&_h2]:mt-10 [&_h2]:mb-3 [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:pl-6 [&_li]:my-1">
          <p>
            WIN Legal Advisors ("we", "us", "our") respects your privacy. This Privacy Policy
            explains what personal information we collect through{" "}
            <strong>www.winlegaladvisors.com</strong> (the "Site"), how we use it, who we share it
            with, and the choices you have. It is designed to align with the Digital Personal Data
            Protection Act, 2023 (DPDP Act) and other applicable Indian laws.
          </p>

          <h2>1. Who is the data fiduciary</h2>
          <p>
            WIN Legal Advisors is the "data fiduciary" for personal information collected through
            the Site. You can reach us at{" "}
            <a href="mailto:contact@winlegaladvisors.com" className="text-gold underline">
              contact@winlegaladvisors.com
            </a>{" "}
            for any privacy-related questions or requests.
          </p>

          <h2>2. What we collect</h2>
          <ul>
            <li>
              <strong>Contact details</strong> you provide — name, email, phone number, company
              name.
            </li>
            <li>
              <strong>Consultation details</strong> — service selected, preferred date and time,
              your notes.
            </li>
            <li>
              <strong>Account information</strong> — sign-in email, authentication provider details
              (e.g., Google), and encrypted session tokens.
            </li>
            <li>
              <strong>Correspondence</strong> — emails, replies, and documents you share with us
              before or during a consultation.
            </li>
            <li>
              <strong>Technical data</strong> — IP address, browser type, device type, referrer,
              and pages visited, collected for security and analytics.
            </li>
          </ul>

          <h2>3. How we use your information</h2>
          <ul>
            <li>To schedule, confirm, reschedule, cancel, and remind you about your consultation.</li>
            <li>To provide the legal services you engage us for.</li>
            <li>To respond to enquiries and support requests.</li>
            <li>To send transactional emails (confirmations, reminders, calendar invites).</li>
            <li>To comply with legal, regulatory, and professional obligations.</li>
            <li>To secure and improve the Site.</li>
          </ul>
          <p>
            We do <strong>not</strong> use your information for unsolicited marketing, and we do
            not sell your personal information.
          </p>

          <h2>4. Legal basis</h2>
          <p>
            We process personal data on the basis of your consent (given when you submit a form or
            book a consultation), our legitimate professional interests (delivering legal services
            you have requested), and where required to comply with the law.
          </p>

          <h2>5. Sharing your information</h2>
          <p>We share information only with:</p>
          <ul>
            <li>
              <strong>Service providers</strong> that help us run the Site and communicate with
              you — hosting, authentication, calendar (Google Calendar), and email delivery. These
              providers process data only on our instructions under confidentiality obligations.
            </li>
            <li>
              <strong>Regulators or courts</strong> where disclosure is required by law or to
              enforce our legal rights.
            </li>
            <li>
              <strong>Professional advisors</strong> (accountants, insurers, auditors) bound by
              confidentiality.
            </li>
          </ul>

          <h2>6. Cookies and analytics</h2>
          <p>
            The Site uses essential cookies for authentication and session management. We may use
            privacy-respecting analytics to understand aggregate usage. You can control cookies
            through your browser settings; disabling essential cookies may break sign-in and
            booking features.
          </p>

          <h2>7. Data retention</h2>
          <p>
            We retain personal information only for as long as necessary to provide our services,
            comply with legal, tax, and professional obligations, and resolve disputes. Consultation
            and engagement records are typically retained for at least the period required by
            applicable professional and tax rules; account data can be deleted on request, subject
            to those obligations.
          </p>

          <h2>8. Security</h2>
          <p>
            We implement reasonable technical and organisational safeguards — encryption in
            transit, access controls, and audited third-party providers — to protect personal
            information. No system is 100% secure, and we cannot guarantee absolute security.
          </p>

          <h2>9. International transfers</h2>
          <p>
            Some of our service providers may process data outside India. Where this happens, we
            take steps to ensure appropriate safeguards are in place, consistent with the DPDP Act
            and applicable law.
          </p>

          <h2>10. Your rights</h2>
          <p>Subject to applicable law, you have the right to:</p>
          <ul>
            <li>Access the personal information we hold about you.</li>
            <li>Ask us to correct or update inaccurate information.</li>
            <li>Withdraw consent for future processing (where processing is based on consent).</li>
            <li>Request deletion of your personal information, subject to legal retention obligations.</li>
            <li>Nominate an individual to exercise your rights in the event of your death or incapacity.</li>
            <li>Lodge a grievance with the Data Protection Board of India where applicable.</li>
          </ul>
          <p>
            To exercise any of these rights, write to{" "}
            <a href="mailto:contact@winlegaladvisors.com" className="text-gold underline">
              contact@winlegaladvisors.com
            </a>
            . We may need to verify your identity before acting on a request.
          </p>

          <h2>11. Children</h2>
          <p>
            The Site is intended for individuals aged 18 and above. We do not knowingly collect
            personal information from children.
          </p>

          <h2>12. Changes to this policy</h2>
          <p>
            We may update this Privacy Policy from time to time. Material changes will be
            highlighted on the Site. Please review the policy periodically.
          </p>

          <h2>13. Grievance officer</h2>
          <p>
            For DPDP Act–related queries or complaints, you may contact our grievance officer at{" "}
            <a href="mailto:contact@winlegaladvisors.com" className="text-gold underline">
              contact@winlegaladvisors.com
            </a>
            .
          </p>
        </div>

        <div className="mt-14 flex flex-wrap gap-4 border-t border-navy/10 pt-8 text-sm">
          <Link to="/terms" className="text-gold hover:underline">Terms of Service</Link>
          <Link to="/contact" className="text-navy hover:text-gold">Contact us</Link>
        </div>
      </main>
    </div>
  );
}
