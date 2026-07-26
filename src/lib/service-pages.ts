import incorporationPdf from "@/assets/checklists/incorporation-checklist.pdf.asset.json";
import trademarkPdf from "@/assets/checklists/trademark-checklist.pdf.asset.json";
import vendorPdf from "@/assets/checklists/vendor-contracts-checklist.pdf.asset.json";

export type ServicePage = {
  slug: "incorporation" | "trademark" | "vendor-contracts";
  eyebrow: string;
  title: string;
  tagline: string;
  intro: string;
  scope: string[];
  deliverables: string[];
  timeline: { phase: string; duration: string; detail: string }[];
  faqs: { q: string; a: string }[];
  seo: { title: string; description: string };
  checklist: { label: string; filename: string; url: string };
};

export const SERVICE_PAGES: Record<ServicePage["slug"], ServicePage> = {
  incorporation: {
    slug: "incorporation",
    eyebrow: "Startup Setup",
    title: "Company Incorporation & Startup Setup",
    tagline: "From idea to legally incorporated entity — done right, once.",
    intro:
      "We help founders choose the correct legal structure and complete every filing needed to launch cleanly in India. Whether you are bootstrapping, raising, or setting up a subsidiary of a foreign parent, our incorporation practice handles the paperwork so you can focus on building.",
    scope: [
      "Entity structuring advisory — Private Limited, LLP, OPC, or Section 8",
      "Name reservation via RUN / SPICe+ Part A",
      "SPICe+ Part B filing with MoA, AoA, INC-9, DIR-2, and subscriber KYC",
      "DIN and Digital Signature Certificate (DSC) for directors",
      "PAN, TAN, GST, Professional Tax, EPFO, and ESIC registrations",
      "Founder equity split, ESOP pool sizing, and vesting advisory",
      "Founders' Agreement and Shareholders' Agreement drafting",
      "Opening bank account KYC pack and board resolutions",
    ],
    deliverables: [
      "Certificate of Incorporation (COI) with CIN",
      "MoA and AoA tailored to your business",
      "PAN, TAN, and GST certificates",
      "Signed Founders' / Shareholders' Agreement",
      "Statutory registers and first board meeting minutes",
      "90-day post-incorporation compliance calendar",
    ],
    timeline: [
      { phase: "Kickoff & structuring", duration: "Day 1–2", detail: "Discovery call, entity recommendation, KYC checklist shared." },
      { phase: "Name reservation", duration: "Day 3–7", detail: "SPICe+ Part A filed; up to two names submitted with justification." },
      { phase: "Incorporation filing", duration: "Day 8–15", detail: "SPICe+ Part B, MoA, AoA, and linked forms filed with MCA." },
      { phase: "Certificate & registrations", duration: "Day 16–25", detail: "COI issued; PAN, TAN, GST, and other registrations activated." },
      { phase: "Founder agreements", duration: "Day 20–30", detail: "Founders' / SHA drafted, negotiated, and executed." },
    ],
    faqs: [
      { q: "Which structure is right for my startup?", a: "For most VC-fundable startups, a Private Limited Company is standard. LLPs suit professional services with two or more partners. We recommend a structure only after understanding your funding plan, co-founders, and tax profile." },
      { q: "How long does incorporation take end-to-end?", a: "Typically 15–25 working days from receipt of complete KYC, assuming no MCA queries. GST and other tax registrations add another 5–10 days." },
      { q: "Do I need a physical office to incorporate?", a: "You need a valid registered office address with a utility bill and NOC from the owner. Co-working addresses and virtual offices are acceptable in most states." },
      { q: "Can foreign nationals be directors or shareholders?", a: "Yes. At least one director must be resident in India. FDI-compliant shareholding is permitted for most sectors under the automatic route." },
      { q: "Do you help with post-incorporation compliance?", a: "Yes — we hand over a 90-day compliance calendar covering INC-20A, auditor appointment, board meetings, and annual ROC filings, and we can retain compliance on a monthly basis." },
    ],
    seo: {
      title: "Company Incorporation Services in India | WIN Legal Advisors",
      description: "End-to-end company incorporation — Private Limited, LLP, OPC — with MoA/AoA, PAN, TAN, GST, and founder agreements. Fixed timelines, transparent scope.",
    },
  },
  trademark: {
    slug: "trademark",
    eyebrow: "Brand Protection",
    title: "Trademark Registration & Brand Protection",
    tagline: "Own your name, logo, and tagline — before someone else does.",
    intro:
      "A brand is only as strong as its registration. We conduct clearance searches, file trademark applications across the right classes, respond to examination reports and oppositions, and enforce your marks against infringers. From single-mark filings to multi-jurisdiction portfolios, we protect what you build.",
    scope: [
      "Public and comprehensive trademark clearance searches",
      "Class identification under the NICE classification (Classes 1–45)",
      "TM-A filing for word marks, device marks, logos, and taglines",
      "Response to examination reports and hearing representation",
      "Opposition and rectification proceedings before the Registry",
      "Trademark assignment, licensing, and franchising agreements",
      "Cease-and-desist notices and infringement enforcement",
      "Madrid Protocol filings for international protection",
    ],
    deliverables: [
      "Clearance search report with risk assessment",
      "Filed TM application with official receipt and TM number",
      "Right to use the ™ symbol immediately post-filing",
      "Registration certificate on approval",
      "Watch report setup for infringement monitoring (optional)",
    ],
    timeline: [
      { phase: "Clearance search", duration: "Day 1–3", detail: "Search across Registry database and common-law usage." },
      { phase: "Filing", duration: "Day 4–7", detail: "TM-A filed; ™ symbol usable from filing date." },
      { phase: "Examination", duration: "Month 3–6", detail: "Registry issues examination report; we file response." },
      { phase: "Publication", duration: "Month 8–12", detail: "Mark published in Trademark Journal for opposition window." },
      { phase: "Registration", duration: "Month 12–24", detail: "Certificate issued if no opposition or after successful defence." },
    ],
    faqs: [
      { q: "Can I use the ™ symbol before registration?", a: "Yes — you can use ™ from the day of filing. The ® symbol may only be used after the mark is registered." },
      { q: "How long does full trademark registration take?", a: "Typically 12–24 months in India if there is no opposition or examination objection. You are legally protected from the filing date once registered." },
      { q: "How many classes should I file in?", a: "You should file in every class relevant to your current and near-term business. Filing in the wrong class leaves gaps. We help you pick the minimum classes that give you real protection." },
      { q: "What happens if someone opposes my mark?", a: "We file a Counter-Statement within two months and represent you through evidence and hearing stages. Most oppositions are resolved without litigation." },
      { q: "Can I protect my brand internationally?", a: "Yes — via the Madrid Protocol you can extend protection to 130+ countries through a single application, provided you have an Indian filing as the base." },
    ],
    seo: {
      title: "Trademark Registration in India | WIN Legal Advisors",
      description: "Trademark search, filing, examination response, opposition defence, and international Madrid Protocol filings. Protect your brand end-to-end.",
    },
  },
  "vendor-contracts": {
    slug: "vendor-contracts",
    eyebrow: "Commercial Contracts",
    title: "Vendor & Supplier Contract Advisory",
    tagline: "Bulletproof contracts with the third parties your business depends on.",
    intro:
      "Every rupee that leaves your company flows through a vendor contract. We draft, review, and negotiate vendor, supplier, MSA, SOW, and SaaS agreements so your commercial terms are enforceable, your SLAs are measurable, and your risk allocation is fair. We work with procurement and founders alike to close deals faster without leaving obligations on the table.",
    scope: [
      "Master Service Agreements (MSAs) and Statements of Work (SOWs)",
      "Vendor onboarding contracts and purchase order terms",
      "Supply agreements, distribution, and reseller contracts",
      "SaaS, cloud, and technology procurement contracts",
      "Service Level Agreements (SLAs) with credit and remedy structures",
      "Data Processing Agreements aligned to the DPDP Act, 2023",
      "Indemnity, limitation of liability, and insurance clause negotiation",
      "Termination, exit assistance, and dispute resolution frameworks",
    ],
    deliverables: [
      "Redlined contract with negotiation notes for every material change",
      "Risk memo highlighting commercial and legal exposure",
      "Playbook of standard positions and fallbacks (for repeat contracting)",
      "Final execution-ready version with signature blocks",
      "Contract register entry with key dates and renewal triggers",
    ],
    timeline: [
      { phase: "Intake & risk framing", duration: "Day 1", detail: "Kickoff call to understand deal value, criticality, and red lines." },
      { phase: "First redline", duration: "Day 2–4", detail: "Full markup with comments and fallback positions." },
      { phase: "Negotiation rounds", duration: "Day 5–10", detail: "Two to three rounds of redlines with counterparty counsel." },
      { phase: "Finalisation", duration: "Day 10–14", detail: "Clean execution version, signature coordination, and archival." },
    ],
    faqs: [
      { q: "Do you review contracts drafted by the other side?", a: "Yes. Most of our vendor work is reviewing and redlining counterparty drafts. We flag every clause that materially shifts risk to you and propose balanced alternatives." },
      { q: "How fast can you turn around a contract review?", a: "Standard turnaround is 3–5 working days for a first redline. Urgent reviews within 24–48 hours are available on a rush basis." },
      { q: "Do you build reusable templates for our procurement team?", a: "Yes. We create MSAs, SOW templates, DPAs, and a negotiation playbook so your team can close low-value contracts internally and escalate only complex ones to us." },
      { q: "Do you handle DPDP Act compliance in vendor contracts?", a: "Absolutely. Every vendor that processes personal data on your behalf needs a Data Processing Agreement aligned to the DPDP Act, 2023 — we build these into your standard vendor pack." },
      { q: "Can you help enforce a contract if a vendor defaults?", a: "Yes. We issue breach notices, negotiate remedies, and if needed pursue arbitration or litigation through our disputes practice." },
    ],
    seo: {
      title: "Vendor & Supplier Contract Advisory | WIN Legal Advisors",
      description: "Drafting, review, and negotiation of MSAs, SOWs, SaaS, and vendor contracts with DPDP-compliant DPAs and enforceable SLAs.",
    },
  },
};
