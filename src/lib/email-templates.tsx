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
}

export const BookingConfirmationEmail: React.FC<BookingEmailProps> = (props) => (
  <Shell preview={`Your consultation request has been received — ${props.service}`}>
    <H1>Your consultation request is in.</H1>
    <P>Dear {props.name},</P>
    <P>
      Thank you for reaching out to WIN Legal Advisors. We've received your
      request for a legal consultation. Our team will review the details and
      confirm a time with you within one business day.
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
      In the meantime, feel free to reply to this email with any additional
      context that will help us prepare.
    </P>
    <P style={{ marginTop: 24 }}>
      Warm regards,
      <br />
      <strong>Adv. Vrushali Borade</strong>
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
