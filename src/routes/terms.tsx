import { createFileRoute, Link } from "@tanstack/react-router";
import logoAsset from "@/assets/win-logo-mark.png.asset.json";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/terms")({
  component: Terms,
  head: () => ({
    meta: [
      { title: "Terms of Service — WIN Legal Advisors" },
      {
        name: "description",
        content:
          "Terms of Service for winlegaladvisors.com — acceptable use, disclaimers, no attorney-client relationship, intellectual property, and governing law.",
      },
      { property: "og:title", content: "Terms of Service — WIN Legal Advisors" },
      { property: "og:description", content: "Terms of Service for winlegaladvisors.com." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: "/terms" }],
  }),
});

function Terms() {
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
        <h1 className="mt-4 font-serif text-4xl font-bold text-navy-deep md:text-5xl">Terms of Service</h1>
        <p className="mt-3 text-sm text-muted-foreground">Last updated: {updated}</p>

        <div className="prose prose-slate mt-10 max-w-none text-navy-soft [&_h2]:font-serif [&_h2]:text-navy-deep [&_h2]:text-2xl [&_h2]:mt-10 [&_h2]:mb-3 [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:pl-6 [&_li]:my-1">
          <h2>1. Acceptance of terms</h2>
          <p>
            These Terms of Service ("Terms") govern your use of{" "}
            <strong>www.winlegaladvisors.com</strong> (the "Site") operated by WIN Legal Advisors
            ("we", "us", "our"). By accessing or using the Site, booking a consultation, or
            submitting a contact form, you agree to be bound by these Terms.
          </p>

          <h2>2. No attorney–client relationship</h2>
          <p>
            Accessing the Site, reading its content, sending us an enquiry, or booking a
            consultation does not, by itself, create an attorney–client relationship. An
            attorney–client relationship is established only through a written engagement letter
            signed by both parties after conflict-of-interest checks.
          </p>

          <h2>3. Not legal advice</h2>
          <p>
            All content on the Site — articles, guides, service descriptions, FAQ answers, and
            confirmations — is provided for general informational purposes only. It is not legal
            advice for any specific situation and should not be relied upon as a substitute for
            advice from a qualified legal professional.
          </p>

          <h2>4. Consultation bookings</h2>
          <ul>
            <li>Initial consultations are complimentary and typically last 30–45 minutes.</li>
            <li>You are responsible for the accuracy of the information you provide when booking.</li>
            <li>
              We may reschedule or decline any booking, including where a conflict of interest is
              identified.
            </li>
            <li>
              You may reschedule up to three times per booking, or cancel any time before the
              appointment, through your account.
            </li>
          </ul>

          <h2>5. Confidentiality</h2>
          <p>
            Information you share with us during or in preparation for a consultation is treated as
            confidential. However, until an engagement letter is signed, such information is not
            covered by attorney–client privilege. Please do not share highly sensitive or privileged
            material through the Site before we have confirmed our engagement.
          </p>

          <h2>6. Intellectual property</h2>
          <p>
            The Site, its design, text, logos (including the WIN Legal Advisors mark), and all
            content are our exclusive property or licensed to us and are protected by applicable
            copyright, trademark, and other intellectual property laws. You may not reproduce,
            distribute, or create derivative works without our prior written consent.
          </p>

          <h2>7. Acceptable use</h2>
          <p>You agree not to:</p>
          <ul>
            <li>Use the Site for any unlawful purpose or to submit false information.</li>
            <li>Attempt to gain unauthorised access to our systems or data.</li>
            <li>Introduce malware, viruses, or automated scraping tools.</li>
            <li>Impersonate any person or misrepresent your affiliation with any organisation.</li>
          </ul>

          <h2>8. Third-party services</h2>
          <p>
            The Site uses third-party services (for example, video-conferencing, calendar, and
            email providers) to deliver its features. Your use of those services is subject to the
            respective provider's terms and privacy policies.
          </p>

          <h2>9. Disclaimers and limitation of liability</h2>
          <p>
            The Site is provided on an "as is" and "as available" basis, without warranties of any
            kind, whether express or implied. To the maximum extent permitted by law, we shall not
            be liable for any indirect, incidental, consequential, or punitive damages arising from
            your use of the Site or from any content on it.
          </p>

          <h2>10. Advertising and solicitation</h2>
          <p>
            Nothing on this Site is intended as advertising or solicitation of professional
            engagement, and it should not be construed as such under the Bar Council of India Rules
            or any other rules of professional conduct applicable to advocates in India.
          </p>

          <h2>11. Changes to these terms</h2>
          <p>
            We may update these Terms from time to time. The "Last updated" date above reflects the
            most recent revision. Continued use of the Site after any change constitutes acceptance
            of the updated Terms.
          </p>

          <h2>12. Governing law</h2>
          <p>
            These Terms are governed by the laws of India. Any disputes arising out of or in
            connection with the Site shall be subject to the exclusive jurisdiction of the competent
            courts of India.
          </p>

          <h2>13. Contact</h2>
          <p>
            Questions about these Terms? Write to us at{" "}
            <a href="mailto:contact@winlegaladvisors.com" className="text-gold underline">
              contact@winlegaladvisors.com
            </a>
            .
          </p>
        </div>

        <div className="mt-14 flex flex-wrap gap-4 border-t border-navy/10 pt-8 text-sm">
          <Link to="/privacy" className="text-gold hover:underline">Privacy Policy</Link>
          <Link to="/contact" className="text-navy hover:text-gold">Contact us</Link>
        </div>
      </main>
    </div>
  );
}
