// React Email templates for WIN Legal Advisors.
// Rendered server-side into HTML + text before being handed to sendLovableEmail.
import * as React from "react";

const NAVY = "#0f1930";
const NAVY_SOFT = "#1a2a4a";
const GOLD = "#c9a24a";
const CREAM = "#faf8f2";
const MUTED = "#7a8299";

const Shell: React.FC<{ preview: string; children: React.ReactNode }> = ({
  preview,
  children,
}) => (
  <html lang="en">
    <head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width" />
      <title>{preview}</title>
    </head>
    <body
      style={{
        margin: 0,
        padding: 0,
        backgroundColor: "#f4f2ec",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
        color: NAVY,
      }}
    >
      <div style={{ display: "none", opacity: 0, maxHeight: 0, overflow: "hidden" }}>
        {preview}
      </div>
      <table
        role="presentation"
        width="100%"
        cellPadding={0}
        cellSpacing={0}
        style={{ backgroundColor: "#f4f2ec", padding: "32px 0" }}
      >
        <tbody>
          <tr>
            <td align="center">
              <table
                role="presentation"
                width="600"
                cellPadding={0}
                cellSpacing={0}
                style={{
                  width: 600,
                  maxWidth: "100%",
                  backgroundColor: CREAM,
                  borderRadius: 12,
                  overflow: "hidden",
                  border: `1px solid ${GOLD}33`,
                }}
              >
                <tbody>
                  <tr>
                    <td
                      style={{
                        backgroundColor: NAVY,
                        padding: "28px 32px",
                        textAlign: "center",
                      }}
                    >
                      <div
                        style={{
                          fontFamily: "'Playfair Display', Georgia, serif",
                          fontSize: 28,
                          fontWeight: 700,
                          color: GOLD,
                          letterSpacing: 2,
                        }}
                      >
                        WIN
                      </div>
                      <div
                        style={{
                          fontSize: 11,
                          textTransform: "uppercase",
                          letterSpacing: 4,
                          color: CREAM,
                          marginTop: 6,
                        }}
                      >
                        Legal Advisors — Vision to Victory
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ padding: "36px 40px", color: NAVY }}>{children}</td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        backgroundColor: NAVY_SOFT,
                        padding: "20px 32px",
                        textAlign: "center",
                        color: CREAM,
                        fontSize: 12,
                      }}
                    >
                      <div>WIN Legal Advisors · www.winlegaladvisors.com</div>
                      <div style={{ marginTop: 4, color: MUTED }}>
                        Corporate · Compliance · Contracts · DPDP · IPR
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    </body>
  </html>
);

const H1: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h1
    style={{
      fontFamily: "'Playfair Display', Georgia, serif",
      fontSize: 26,
      lineHeight: 1.2,
      margin: "0 0 16px",
      color: NAVY,
    }}
  >
    {children}
  </h1>
);

const P: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({
  children,
  style,
}) => (
  <p
    style={{ fontSize: 15, lineHeight: 1.6, margin: "0 0 14px", color: NAVY, ...style }}
  >
    {children}
  </p>
);

const DetailRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <tr>
    <td
      style={{
        padding: "10px 0",
        borderBottom: `1px solid ${GOLD}33`,
        fontSize: 12,
        textTransform: "uppercase",
        letterSpacing: 1.5,
        color: MUTED,
        width: 140,
      }}
    >
      {label}
    </td>
    <td
      style={{
        padding: "10px 0",
        borderBottom: `1px solid ${GOLD}33`,
        fontSize: 15,
        color: NAVY,
        fontWeight: 500,
      }}
    >
      {value}
    </td>
  </tr>
);

export interface BookingEmailProps {
  name: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  service: string;
  preferredDate: string;
  preferredTime: string;
  message?: string | null;
  bookingId?: string;
  cancelled?: boolean;
  rescheduled?: boolean;
  googleCalendarUrl?: string;
  icsUrl?: string;
  manageUrl?: string;
  pdfUrl?: string;
}

const CalButton: React.FC<{ href: string; children: React.ReactNode; primary?: boolean }> = ({
  href,
  children,
  primary,
}) => (
  <a
    href={href}
    style={{
      display: "inline-block",
      padding: "12px 22px",
      borderRadius: 999,
      fontSize: 14,
      fontWeight: 600,
      textDecoration: "none",
      marginRight: 8,
      marginBottom: 8,
      color: primary ? NAVY : CREAM,
      backgroundColor: primary ? GOLD : NAVY,
      border: primary ? `1px solid ${GOLD}` : `1px solid ${NAVY}`,
    }}
  >
    {children}
  </a>
);

export const BookingConfirmationEmail: React.FC<BookingEmailProps> = (props) => (
  <Shell preview={`Your consultation request has been received — ${props.service}`}>
    <H1>
      {props.cancelled
        ? "Your consultation has been cancelled"
        : props.rescheduled
          ? "Your consultation has been rescheduled"
          : "Your consultation request is in."}
    </H1>
    <P>Dear {props.name},</P>
    <P>
      {props.cancelled
        ? "We've cancelled your consultation as requested. You can book a new time whenever you're ready."
        : "Thank you for reaching out to WIN Legal Advisors. We've received your request for a legal consultation. Our team will review the details and confirm a time with you within one business day."}
    </P>
    <table role="presentation" width="100%" cellPadding={0} cellSpacing={0} style={{ margin: "20px 0" }}>
      <tbody>
        <DetailRow label="Service" value={props.service} />
        <DetailRow label="Preferred Date" value={props.preferredDate} />
        <DetailRow label="Preferred Time" value={props.preferredTime} />
        {props.company ? <DetailRow label="Company" value={props.company} /> : null}
        {props.phone ? <DetailRow label="Phone" value={props.phone} /> : null}
      </tbody>
    </table>
    {!props.cancelled && (props.googleCalendarUrl || props.icsUrl) ? (
      <>
        <P style={{ marginTop: 8, fontSize: 13, color: MUTED, textTransform: "uppercase", letterSpacing: 1.5 }}>
          Add to your calendar
        </P>
        <div style={{ margin: "8px 0 20px" }}>
          {props.googleCalendarUrl ? (
            <CalButton href={props.googleCalendarUrl} primary>
              Add to Google Calendar
            </CalButton>
          ) : null}
          {props.icsUrl ? <CalButton href={props.icsUrl}>Download .ics (Apple / Outlook)</CalButton> : null}
          {props.pdfUrl ? <CalButton href={props.pdfUrl}>Download PDF summary</CalButton> : null}
        </div>
      </>
    ) : null}
    {props.manageUrl ? (
      <P style={{ fontSize: 13, color: MUTED }}>
        Need to change plans? <a href={props.manageUrl} style={{ color: NAVY, fontWeight: 600 }}>Reschedule or cancel</a>.
      </P>
    ) : null}
    {props.message ? (
      <>
        <P>
          <strong style={{ color: NAVY }}>Your note:</strong>
        </P>
        <P>
          <em style={{ color: NAVY_SOFT }}>{props.message}</em>
        </P>
      </>
    ) : null}
    <P>
      Before our call, please have these ready if relevant: incorporation documents, key contracts under review,
      any notices or regulatory correspondence, and a brief summary of what you'd like to discuss. Reply to this
      email with any documents you'd like us to review in advance.
    </P>
    <P style={{ marginTop: 24 }}>
      Warm regards,
      <br />
      <strong>Vrushali Borade</strong>
      <br />
      <span style={{ color: MUTED, fontSize: 13 }}>Founder, WIN Legal Advisors</span>
    </P>
  </Shell>
);

export interface ContactEmailProps {
  name: string;
  subject?: string | null;
  message: string;
}

export const ContactConfirmationEmail: React.FC<ContactEmailProps> = (props) => (
  <Shell preview="We received your message at WIN Legal Advisors">
    <H1>Thanks for getting in touch.</H1>
    <P>Dear {props.name},</P>
    <P>
      We've received your message and one of our advisors will get back to you
      shortly — typically within one business day.
    </P>
    {props.subject ? (
      <table role="presentation" width="100%" cellPadding={0} cellSpacing={0} style={{ margin: "20px 0" }}>
        <tbody>
          <DetailRow label="Subject" value={props.subject} />
        </tbody>
      </table>
    ) : null}
    <P>
      <strong>Your message:</strong>
    </P>
    <P>
      <em style={{ color: NAVY_SOFT }}>{props.message}</em>
    </P>
    <P style={{ marginTop: 24 }}>
      Warm regards,
      <br />
      <strong>WIN Legal Advisors</strong>
    </P>
  </Shell>
);

export interface ReminderEmailProps {
  name: string;
  service: string;
  preferredDate: string;
  preferredTime: string;
  when: "24h" | "2h";
  googleCalendarUrl?: string;
  icsUrl?: string;
  manageUrl?: string;
  pdfUrl?: string;
}

export const BookingReminderEmail: React.FC<ReminderEmailProps> = (props) => {
  const soonLabel = props.when === "2h" ? "in about 2 hours" : "tomorrow";
  return (
    <Shell preview={`Reminder: your consultation is ${soonLabel} — ${props.service}`}>
      <H1>Your consultation is {soonLabel}.</H1>
      <P>Dear {props.name},</P>
      <P>
        This is a friendly reminder about your upcoming legal consultation with WIN Legal
        Advisors. We're looking forward to speaking with you.
      </P>
      <table role="presentation" width="100%" cellPadding={0} cellSpacing={0} style={{ margin: "20px 0" }}>
        <tbody>
          <DetailRow label="Service" value={props.service} />
          <DetailRow label="Date" value={props.preferredDate} />
          <DetailRow label="Time" value={props.preferredTime} />
          <DetailRow label="Format" value="Secure video call" />
        </tbody>
      </table>
      {props.googleCalendarUrl || props.icsUrl || props.pdfUrl ? (
        <>
          <P style={{ marginTop: 8, fontSize: 13, color: MUTED, textTransform: "uppercase", letterSpacing: 1.5 }}>
            Quick links
          </P>
          <div style={{ margin: "8px 0 20px" }}>
            {props.googleCalendarUrl ? (
              <CalButton href={props.googleCalendarUrl} primary>Add to Google Calendar</CalButton>
            ) : null}
            {props.icsUrl ? <CalButton href={props.icsUrl}>Download .ics</CalButton> : null}
            {props.pdfUrl ? <CalButton href={props.pdfUrl}>Booking PDF</CalButton> : null}
          </div>
        </>
      ) : null}
      {props.when === "24h" ? (
        <P>
          A quick checklist before we speak: incorporation documents, key contracts under review,
          any notices or regulatory correspondence, and a short one-page summary of what you'd
          like to discuss. Reply to this email with anything you'd like us to review in advance.
        </P>
      ) : (
        <P>
          The video call link will be shared shortly. Please join a couple of minutes early to
          check your audio and camera.
        </P>
      )}
      {props.manageUrl ? (
        <P style={{ fontSize: 13, color: MUTED }}>
          Plans changed? <a href={props.manageUrl} style={{ color: NAVY, fontWeight: 600 }}>Reschedule or cancel</a>.
        </P>
      ) : null}
      <P style={{ marginTop: 24 }}>
        Warm regards,
        <br />
        <strong>WIN Legal Advisors</strong>
      </P>
    </Shell>
  );
};
