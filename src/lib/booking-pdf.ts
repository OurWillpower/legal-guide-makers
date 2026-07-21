// Server-side PDF generator for booking confirmations.
// pdf-lib is pure JS and runs in the Cloudflare Worker runtime.
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export interface BookingPdfInput {
  bookingId: string;
  name: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  service: string;
  preferredDate: string;
  preferredTime: string;
  message?: string | null;
  status?: string | null;
  cancelledAt?: string | null;
  createdAt?: string | null;
}

const NAVY = rgb(15 / 255, 25 / 255, 48 / 255);
const NAVY_SOFT = rgb(26 / 255, 42 / 255, 74 / 255);
const GOLD = rgb(201 / 255, 162 / 255, 74 / 255);
const CREAM = rgb(250 / 255, 248 / 255, 242 / 255);
const MUTED = rgb(122 / 255, 130 / 255, 153 / 255);

function wrap(text: string, max = 90): string[] {
  const words = text.split(/\s+/);
  const out: string[] = [];
  let line = "";
  for (const w of words) {
    if ((line + " " + w).trim().length > max) {
      if (line) out.push(line);
      line = w;
    } else {
      line = (line + " " + w).trim();
    }
  }
  if (line) out.push(line);
  return out;
}

export async function generateBookingPdf(b: BookingPdfInput): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const page = doc.addPage([595.28, 841.89]); // A4
  const { width, height } = page.getSize();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const serif = await doc.embedFont(StandardFonts.TimesRomanBold);

  // Header band
  page.drawRectangle({ x: 0, y: height - 110, width, height: 110, color: NAVY });
  page.drawText("WIN", {
    x: 40, y: height - 60,
    size: 32, font: serif, color: GOLD,
  });
  page.drawText("LEGAL ADVISORS", {
    x: 40, y: height - 82,
    size: 11, font: bold, color: CREAM,
  });
  page.drawText("VISION TO VICTORY", {
    x: 40, y: height - 97,
    size: 8, font, color: rgb(0.82, 0.75, 0.55),
  });
  page.drawText("Consultation Confirmation", {
    x: width - 40 - bold.widthOfTextAtSize("Consultation Confirmation", 14),
    y: height - 60,
    size: 14, font: bold, color: CREAM,
  });
  page.drawText(`Booking #${b.bookingId.slice(0, 8).toUpperCase()}`, {
    x: width - 40 - font.widthOfTextAtSize(`Booking #${b.bookingId.slice(0, 8).toUpperCase()}`, 10),
    y: height - 82,
    size: 10, font, color: rgb(0.82, 0.75, 0.55),
  });

  const cancelled = Boolean(b.cancelledAt);
  const status = cancelled ? "CANCELLED" : (b.status || "PENDING").toUpperCase();
  const statusColor = cancelled ? rgb(0.72, 0.13, 0.13) : status === "CONFIRMED" ? rgb(0.09, 0.5, 0.32) : GOLD;

  let y = height - 150;

  // Status pill
  const pillW = bold.widthOfTextAtSize(status, 10) + 22;
  page.drawRectangle({ x: 40, y: y - 4, width: pillW, height: 20, color: CREAM, borderColor: statusColor, borderWidth: 1 });
  page.drawText(status, { x: 51, y: y + 2, size: 10, font: bold, color: statusColor });
  y -= 40;

  page.drawText(`Dear ${b.name},`, { x: 40, y, size: 12, font: bold, color: NAVY });
  y -= 22;

  const intro = cancelled
    ? "This consultation has been cancelled. You can book a new time whenever you're ready."
    : "Thank you for booking a legal consultation with WIN Legal Advisors. This document summarises your appointment. Our team will confirm your slot within one business day.";
  for (const line of wrap(intro, 95)) {
    page.drawText(line, { x: 40, y, size: 11, font, color: NAVY_SOFT });
    y -= 15;
  }
  y -= 14;

  // Details box
  page.drawRectangle({ x: 40, y: y - 210, width: width - 80, height: 210, color: CREAM, borderColor: GOLD, borderWidth: 0.5 });
  page.drawText("APPOINTMENT DETAILS", { x: 55, y: y - 22, size: 9, font: bold, color: MUTED });

  const rows: [string, string][] = [
    ["Service", b.service],
    ["Preferred date", b.preferredDate],
    ["Preferred time", b.preferredTime],
    ["Duration", "45 minutes"],
    ["Format", "Secure video call (link to follow)"],
    ["Client", b.name],
    ["Email", b.email],
    ["Phone", b.phone || "—"],
    ["Company", b.company || "—"],
  ];
  let rowY = y - 42;
  for (const [k, v] of rows) {
    page.drawText(k.toUpperCase(), { x: 55, y: rowY, size: 8, font: bold, color: MUTED });
    page.drawText(v, { x: 190, y: rowY, size: 11, font, color: NAVY });
    rowY -= 18;
  }
  y -= 230;

  if (b.message) {
    page.drawText("YOUR NOTE", { x: 40, y, size: 9, font: bold, color: MUTED });
    y -= 16;
    for (const line of wrap(b.message, 95)) {
      page.drawText(line, { x: 40, y, size: 10, font, color: NAVY_SOFT });
      y -= 13;
      if (y < 200) break;
    }
    y -= 10;
  }

  // Prep checklist
  page.drawText("BEFORE OUR CALL — HELPFUL DOCUMENTS", { x: 40, y, size: 9, font: bold, color: MUTED });
  y -= 16;
  const prep = [
    "Incorporation certificate, MoA / AoA (if relevant).",
    "Key contracts under review (customer, vendor, employment, SaaS).",
    "Term sheets, SHA drafts, or investor correspondence.",
    "DPDP / privacy notices, data-flow diagrams (for DPDP scoping).",
    "Any notices or regulatory correspondence.",
    "A one-page summary of what you'd like to discuss.",
  ];
  for (const item of prep) {
    page.drawText("•", { x: 44, y, size: 10, font: bold, color: GOLD });
    page.drawText(item, { x: 56, y, size: 10, font, color: NAVY_SOFT });
    y -= 14;
  }

  // Footer
  page.drawLine({ start: { x: 40, y: 90 }, end: { x: width - 40, y: 90 }, color: GOLD, thickness: 0.5 });
  page.drawText("WIN Legal Advisors  ·  Corporate · Compliance · Contracts · DPDP · IPR", {
    x: 40, y: 72, size: 9, font, color: NAVY_SOFT,
  });
  page.drawText("hello@winlegaladvisors.com  ·  www.winlegaladvisors.com", {
    x: 40, y: 58, size: 9, font, color: NAVY_SOFT,
  });
  page.drawText("Confidential. Attorney–client privilege applies.", {
    x: 40, y: 40, size: 8, font, color: MUTED,
  });
  const generated = `Generated ${new Date().toUTCString()}`;
  page.drawText(generated, {
    x: width - 40 - font.widthOfTextAtSize(generated, 8),
    y: 40, size: 8, font, color: MUTED,
  });

  return await doc.save();
}
