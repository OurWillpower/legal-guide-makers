import incorporationPdf from "@/assets/checklists/incorporation-checklist.pdf.asset.json";
import trademarkPdf from "@/assets/checklists/trademark-checklist.pdf.asset.json";
import vendorPdf from "@/assets/checklists/vendor-contracts-checklist.pdf.asset.json";

export type ServicePage = {
  slug: string;
  eyebrow: string;
  title: string;
  tagline: string;
  intro: string;
  scope: string[];
  deliverables: string[];
  timeline: { phase: string; duration: string; detail: string }[];
  faqs: { q: string; a: string }[];
  seo: { title: string; description: string };
  checklist?: { label: string; filename: string; url: string };
};

export const SERVICE_PAGES: Record<string, ServicePage> = {
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
    checklist: { label: "Incorporation Checklist (PDF)", filename: "incorporation-checklist.pdf", url: incorporationPdf.url },
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
    checklist: { label: "Trademark Filing Checklist (PDF)", filename: "trademark-checklist.pdf", url: trademarkPdf.url },
  },
  "vendor-contracts": {
    slug: "vendor-contracts",
    eyebrow: "Commercial Contracts",
    title: "Vendor & Supplier Contract Advisory",
    tagline: "Bulletproof contracts with the third parties your business depends on.",
    intro:
      "Every rupee that leaves your company flows through a vendor contract. We draft, review, and negotiate vendor, supplier, MSA, SOW, and SaaS agreements so your commercial terms are enforceable, your SLAs are measurable, and your risk allocation is fair.",
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
    checklist: { label: "Vendor Contract Review Checklist (PDF)", filename: "vendor-contracts-checklist.pdf", url: vendorPdf.url },
  },
  "corporate-legal": {
    slug: "corporate-legal",
    eyebrow: "General Counsel",
    title: "Corporate Legal Services",
    tagline: "End-to-end legal support for businesses at every stage of growth.",
    intro:
      "We act as your outsourced general counsel — covering board governance, secretarial compliance, contract lifecycle, employment, and day-to-day legal risk. One accountable team, on retainer, so legal never becomes a bottleneck.",
    scope: [
      "Board and shareholder meetings — notices, agendas, minutes, and resolutions",
      "Companies Act, 2013 secretarial compliance and ROC filings",
      "Employment contracts, HR policies, and POSH implementation",
      "Contract lifecycle management and standard-form templates",
      "Corporate governance frameworks and delegation matrices",
      "Legal risk registers and quarterly compliance reviews",
    ],
    deliverables: [
      "Monthly compliance calendar with owners and deadlines",
      "Board and general meeting packs, minutes, and resolutions",
      "Employment and HR policy pack (offer, contract, POSH, code of conduct)",
      "Contract templates library with usage playbook",
      "Quarterly legal health report to founders and the board",
    ],
    timeline: [
      { phase: "Onboarding", duration: "Week 1", detail: "Diagnostic review of existing contracts, filings, and policies." },
      { phase: "Baseline fixes", duration: "Week 2–4", detail: "Close open filings, update statutory registers, deploy templates." },
      { phase: "Ongoing retainer", duration: "Monthly", detail: "Scheduled reviews, ad-hoc queries, and board support on retainer." },
    ],
    faqs: [
      { q: "Do you work on a retainer or per-matter basis?", a: "Both. Most clients prefer a monthly retainer for predictable coverage, with rate cards for out-of-scope matters." },
      { q: "Can you replace an in-house legal team?", a: "For early- and mid-stage companies, yes. We scale from fractional general counsel to a dedicated team as you grow." },
      { q: "Do you handle secretarial filings too?", a: "Yes — all Companies Act filings, event-based forms, and annual returns are part of standard retainer scope." },
    ],
    seo: {
      title: "Corporate Legal Services & Outsourced General Counsel | WIN Legal Advisors",
      description: "Retainer-based corporate legal support — governance, secretarial compliance, employment, and contract lifecycle for growing companies.",
    },
  },
  "contracts-commercial": {
    slug: "contracts-commercial",
    eyebrow: "Commercial Advisory",
    title: "Contracts & Commercial Advisory",
    tagline: "Drafting, review, and negotiation that protects your interests.",
    intro:
      "From founder agreements to seven-figure MSAs, our contracts practice covers the full commercial stack. We combine plain-language drafting with sharp risk analysis so every agreement is enforceable, balanced, and fast to close.",
    scope: [
      "Founders', shareholders', and investment agreements (SSA, SHA)",
      "MSAs, SOWs, NDAs, and consulting agreements",
      "SaaS, subscription, and licence agreements",
      "Channel partner, reseller, and distribution contracts",
      "Term sheets and definitive documents for fundraising",
      "Employment, ESOP, and independent contractor agreements",
    ],
    deliverables: [
      "First-draft or redline with commercial commentary",
      "Risk memo covering material clauses and fallback positions",
      "Execution-ready contract with signature workflow",
      "Contract summary sheet for internal records",
    ],
    timeline: [
      { phase: "Brief", duration: "Day 1", detail: "Deal context, counterparty, red lines, and target close date." },
      { phase: "Draft / redline", duration: "Day 2–5", detail: "First markup with negotiation notes." },
      { phase: "Negotiation", duration: "Day 5–14", detail: "Rounds with counterparty until commercially aligned." },
      { phase: "Execution", duration: "Day 14+", detail: "Clean version, signature blocks, and archival." },
    ],
    faqs: [
      { q: "Can you turn around urgent contracts in 24 hours?", a: "Yes — we offer a rush lane for time-sensitive drafts and reviews, subject to counsel availability." },
      { q: "Will you help negotiate directly with the counterparty?", a: "Yes. We join calls with counterparty counsel and lead negotiations when you want us to." },
      { q: "Do you draft in Indian and cross-border formats?", a: "Yes — we handle Indian-law contracts and cross-border deals governed by English, Singapore, or Delaware law with local counsel coordination." },
    ],
    seo: {
      title: "Contracts & Commercial Advisory | WIN Legal Advisors",
      description: "Drafting, review, and negotiation of MSAs, SaaS, NDAs, founder and shareholder agreements — commercial contracts done end-to-end.",
    },
  },
  "ip-innovation": {
    slug: "ip-innovation",
    eyebrow: "Intellectual Property",
    title: "Intellectual Property & Innovation",
    tagline: "Protect your ideas, brands, inventions, and intellectual assets.",
    intro:
      "IP is the balance sheet of a modern company. We help you identify, secure, license, and enforce every category of intellectual property — trademarks, copyrights, designs, patents, and trade secrets — with a portfolio strategy that scales.",
    scope: [
      "IP audits and portfolio strategy",
      "Trademark, copyright, and design registration",
      "Patent search, drafting, and prosecution via panel patent agents",
      "Trade secret and confidentiality frameworks",
      "IP assignment, licensing, and technology transfer agreements",
      "Enforcement — cease-and-desist, takedown, and infringement litigation",
    ],
    deliverables: [
      "IP audit report and portfolio roadmap",
      "Filed applications and prosecution updates",
      "Assignment / licence agreements ready for execution",
      "Enforcement pack — notices, evidence dossier, and litigation strategy",
    ],
    timeline: [
      { phase: "Audit", duration: "Week 1–2", detail: "Inventory of existing IP and gap analysis." },
      { phase: "Filings", duration: "Week 2–6", detail: "Priority filings across trademark, copyright, and design." },
      { phase: "Prosecution", duration: "Ongoing", detail: "Examination responses, hearings, and grant." },
    ],
    faqs: [
      { q: "Do you handle patents in-house?", a: "We drive strategy and coordinate with empanelled patent agents for drafting and prosecution before the Indian Patent Office and PCT." },
      { q: "How do we protect source code and product designs?", a: "Copyright covers source code; industrial designs cover product shape and configuration. We combine both plus trade-secret protocols and NDAs." },
      { q: "Can you enforce IP internationally?", a: "Yes — through our network of counsel we handle takedowns, cease-and-desist, and litigation across major jurisdictions." },
    ],
    seo: {
      title: "Intellectual Property & Innovation Services | WIN Legal Advisors",
      description: "IP audits, filings, licensing, and enforcement across trademarks, copyrights, designs, patents, and trade secrets.",
    },
  },
  "licensing-registrations": {
    slug: "licensing-registrations",
    eyebrow: "Licensing",
    title: "Licensing & Registrations",
    tagline: "Every business licence and registration your entity needs — under one roof.",
    intro:
      "From day-one registrations to sector-specific licences, we handle the paperwork, submissions, and follow-ups across central and state authorities so your operations are always compliant.",
    scope: [
      "GST, PAN, TAN, and Professional Tax registration",
      "MSME / Udyam and Startup India (DPIIT) recognition",
      "Shops & Establishment and labour registrations",
      "FSSAI, Legal Metrology, and packaging compliance",
      "Import Export Code (IEC) and DGFT registrations",
      "Sector-specific licences — NBFC, PSA, RBI, TRAI, PESO, and more",
    ],
    deliverables: [
      "Filed applications with government receipts",
      "Issued licences and registration certificates",
      "Renewal calendar with statutory due dates",
    ],
    timeline: [
      { phase: "KYC & scoping", duration: "Day 1–2", detail: "Identify applicable registrations and gather documents." },
      { phase: "Filings", duration: "Day 3–15", detail: "Submissions to relevant authorities." },
      { phase: "Approval & handover", duration: "Day 15–45", detail: "Follow-up, query responses, and certificate delivery." },
    ],
    faqs: [
      { q: "Which registrations does a new company need on day one?", a: "Typically PAN, TAN, GST (if applicable), Professional Tax, and Shops & Establishment. Sector-specific licences depend on your business." },
      { q: "Can you handle multi-state licences?", a: "Yes. We coordinate filings and renewals across every state where you operate." },
      { q: "Do you manage renewals?", a: "Yes — we maintain a renewal calendar and file well in advance of expiry." },
    ],
    seo: {
      title: "Business Licensing & Registrations in India | WIN Legal Advisors",
      description: "GST, MSME, FSSAI, IEC, Shops & Establishment, and sector-specific licences — filed, tracked, and renewed on time.",
    },
  },
  "dpdp-privacy": {
    slug: "dpdp-privacy",
    eyebrow: "Data Privacy",
    title: "DPDP & Data Privacy Compliance",
    tagline: "Ready your organization for the DPDP Act, 2023 and global privacy laws.",
    intro:
      "Personal data is regulated like never before. We help organizations map data flows, deploy consent and notice frameworks, sign DPAs with vendors, respond to data-principal requests, and prepare for breach reporting under the DPDP Act, GDPR, and adjacent regimes.",
    scope: [
      "Data mapping and Records of Processing Activities (RoPA)",
      "DPDP-compliant privacy notices, consent flows, and preference centres",
      "Data Processing Agreements (DPAs) with vendors and sub-processors",
      "Data Principal request workflows (access, correction, erasure)",
      "Breach response playbook and Board-of-DPDP notification templates",
      "Data Protection Officer (DPO) advisory and training",
      "Cross-border transfer assessments (SCCs, adequacy)",
    ],
    deliverables: [
      "Data inventory and RoPA",
      "Website privacy notice, cookie banner, and consent manager configuration",
      "DPA templates and vendor register",
      "DPDP compliance dashboard and residual-risk memo",
    ],
    timeline: [
      { phase: "Discovery", duration: "Week 1–2", detail: "Data mapping across products, HR, and vendors." },
      { phase: "Framework", duration: "Week 3–5", detail: "Notices, consent, DPAs, and internal SOPs." },
      { phase: "Rollout", duration: "Week 6–8", detail: "Training, DPO onboarding, and breach drill." },
    ],
    faqs: [
      { q: "Is the DPDP Act in force?", a: "The Act is enacted; operative provisions and the Data Protection Board are being notified in phases. We help you get compliance-ready ahead of hard deadlines." },
      { q: "Do we need a DPO?", a: "Significant Data Fiduciaries must appoint a DPO. Even where optional, most enterprises assign a DPO or privacy lead as a governance best practice." },
      { q: "How do we handle child data?", a: "Verifiable parental consent is required for users under 18. We design age-gating and consent workflows accordingly." },
    ],
    seo: {
      title: "DPDP Act & Data Privacy Compliance | WIN Legal Advisors",
      description: "DPDP Act 2023 readiness — data mapping, notices, consent, DPAs, breach response, and DPO advisory for Indian and global privacy regimes.",
    },
  },
  "tech-ai-cyber": {
    slug: "tech-ai-cyber",
    eyebrow: "Tech, AI & Cyber",
    title: "Technology, AI & Cyber Law",
    tagline: "Guidance on AI, SaaS, cybersecurity, and emerging technologies.",
    intro:
      "Technology outpaces regulation — and getting caught on the wrong side is expensive. We advise on AI governance, SaaS product terms, cyber incident response, IT Act obligations, and CERT-In directions so you can ship fast without legal exposure.",
    scope: [
      "AI governance frameworks, model cards, and use-case risk classification",
      "SaaS terms of service, acceptable use, and DPA suite",
      "IT Act compliance — intermediary obligations, grievance officer, takedowns",
      "CERT-In directions — logging, retention, and 6-hour incident reporting",
      "Cyber incident response — breach notifications and regulator liaison",
      "eCommerce Rules, consumer protection, and dark-pattern advisory",
    ],
    deliverables: [
      "AI governance policy and product-launch review",
      "SaaS ToS, DPA, and acceptable-use policy",
      "IT Act compliance pack including grievance mechanism",
      "Incident response playbook with contact tree",
    ],
    timeline: [
      { phase: "Diagnostic", duration: "Week 1", detail: "Map products, data flows, and regulatory touchpoints." },
      { phase: "Documentation", duration: "Week 2–4", detail: "Deploy policies, contracts, and playbooks." },
      { phase: "Retainer", duration: "Ongoing", detail: "Ad-hoc queries, launch reviews, and incident support." },
    ],
    faqs: [
      { q: "Do you review AI features before launch?", a: "Yes — we run pre-launch risk reviews covering IP, privacy, IT Act, and consumer-protection exposure for AI features." },
      { q: "What are CERT-In reporting timelines?", a: "Cyber incidents must be reported to CERT-In within 6 hours of noticing. We build the playbook, template, and escalation tree." },
      { q: "Do you help with US and EU tech regulations?", a: "Yes — including CCPA, GDPR, EU AI Act, and DSA — through our cross-border network." },
    ],
    seo: {
      title: "Technology, AI & Cyber Law | WIN Legal Advisors",
      description: "AI governance, SaaS contracts, IT Act, CERT-In compliance, and cyber incident response for technology-first businesses.",
    },
  },
  "ma-jv": {
    slug: "ma-jv",
    eyebrow: "M&A and JV",
    title: "Mergers, Acquisitions & Joint Ventures",
    tagline: "Strategic legal support from term sheet to closing.",
    intro:
      "We advise founders, PE/VC funds, and strategic acquirers on the full deal lifecycle — structuring, diligence, definitive documents, regulatory approvals, and closing mechanics — with a commercial lens focused on getting the deal done.",
    scope: [
      "Deal structuring — share purchase, asset transfer, slump sale, merger",
      "Term sheets, letters of intent, and exclusivity arrangements",
      "Legal due diligence — corporate, contracts, IP, HR, litigation, regulatory",
      "SPA, SHA, SSA, business transfer, and merger documentation",
      "CCI, FEMA, and sector-regulator filings",
      "Closing mechanics, escrow arrangements, and post-closing integration",
    ],
    deliverables: [
      "Structuring memo and risk map",
      "Diligence report with red-flag summary",
      "Definitive documents and disclosure schedules",
      "Regulatory approvals and closing checklist",
    ],
    timeline: [
      { phase: "Structuring", duration: "Week 1–2", detail: "Deal structure, tax lens, and term sheet." },
      { phase: "Diligence", duration: "Week 3–6", detail: "Legal DD and issues list." },
      { phase: "Definitive docs", duration: "Week 5–10", detail: "Drafting and negotiation." },
      { phase: "Closing", duration: "Week 10–14", detail: "Conditions precedent, approvals, and completion." },
    ],
    faqs: [
      { q: "Do you represent buy-side and sell-side?", a: "Yes — we advise founders, targets, PE/VC funds, and strategic acquirers." },
      { q: "Do you handle cross-border deals?", a: "Yes, including inbound FDI and outbound investments, coordinated with foreign counsel." },
      { q: "How do you keep deals moving?", a: "We run an issues list, weekly deal calls, and a shared workstream tracker so nothing stalls." },
    ],
    seo: {
      title: "M&A, Joint Ventures & Fundraising Advisory | WIN Legal Advisors",
      description: "Deal structuring, due diligence, definitive documents, and regulatory approvals for M&A, JVs, and fundraising transactions.",
    },
  },
  "regulatory-compliance": {
    slug: "regulatory-compliance",
    eyebrow: "Regulatory",
    title: "Regulatory & Compliance",
    tagline: "Advisory on regulatory frameworks and ongoing compliance calendars.",
    intro:
      "Regulated sectors reward companies that operate cleanly. We interpret regulations, manage regulator interactions, and build compliance calendars that keep your operations audit-ready year-round.",
    scope: [
      "FEMA, RBI, and cross-border remittance advisory",
      "SEBI listing, disclosure, and insider trading compliance",
      "Sector regulators — IRDAI, TRAI, MoEF, PESO, FSSAI, and more",
      "Anti-bribery, competition, and trade-compliance frameworks",
      "Companies Act ongoing compliance calendars",
      "Regulator representation, show-cause responses, and inspections",
    ],
    deliverables: [
      "Sector compliance manual",
      "Compliance calendar with owners and due dates",
      "Regulator correspondence and filings archive",
      "Annual audit-readiness report",
    ],
    timeline: [
      { phase: "Diagnostic", duration: "Week 1–2", detail: "Regulatory mapping and gap analysis." },
      { phase: "Remediation", duration: "Week 3–6", detail: "Close gaps, deploy calendar, and train teams." },
      { phase: "Ongoing", duration: "Monthly", detail: "Filings, reviews, and regulator liaison." },
    ],
    faqs: [
      { q: "Do you handle inspections and show-cause notices?", a: "Yes — we respond to notices, represent you at hearings, and negotiate settlements where appropriate." },
      { q: "Can you build a compliance calendar for our sector?", a: "Yes — we build sector-specific calendars with statutory due dates, filing formats, and owners." },
      { q: "Do you cover state-level regulators?", a: "Yes — labour, pollution, and state regulators across every state where you operate." },
    ],
    seo: {
      title: "Regulatory & Compliance Advisory | WIN Legal Advisors",
      description: "FEMA, RBI, SEBI, and sectoral regulatory advisory with audit-ready compliance calendars and regulator representation.",
    },
  },
  "litigation-dispute": {
    slug: "litigation-dispute",
    eyebrow: "Disputes",
    title: "Litigation & Dispute Resolution",
    tagline: "Effective representation across courts, tribunals, and arbitration.",
    intro:
      "When disputes hit, you need commercially minded litigators who focus on outcomes, not adjournments. We handle commercial suits, arbitration, insolvency, and regulatory disputes with a clear strategy and cost budget.",
    scope: [
      "Commercial suits before High Courts and Commercial Courts",
      "Domestic and international arbitration (SIAC, ICC, LCIA, DIAC, MCIA)",
      "IBC proceedings before NCLT and NCLAT",
      "Consumer, competition, and regulatory tribunals",
      "Enforcement of decrees and arbitral awards",
      "Pre-dispute strategy, mediation, and settlement negotiation",
    ],
    deliverables: [
      "Case assessment memo with strategy and cost budget",
      "Pleadings, applications, and evidence dossier",
      "Hearing representation and status reports",
      "Settlement drafts and enforcement filings",
    ],
    timeline: [
      { phase: "Case assessment", duration: "Week 1", detail: "Merits review, strategy, and cost estimate." },
      { phase: "Pleadings", duration: "Week 2–6", detail: "Notice, plaint or reply, and interim applications." },
      { phase: "Hearings", duration: "Ongoing", detail: "Regular hearings with status updates after each date." },
    ],
    faqs: [
      { q: "Do you offer fixed-fee or milestone billing?", a: "Yes — most commercial matters are billed on phase-based milestones with a clear budget upfront." },
      { q: "Can you enforce a foreign arbitral award in India?", a: "Yes — we handle enforcement under Part II of the Arbitration Act for New York and Geneva Convention awards." },
      { q: "Do you try to settle first?", a: "Where commercially sensible, yes — early settlement often beats a multi-year litigation. We advise honestly on when to fight and when to settle." },
    ],
    seo: {
      title: "Litigation & Dispute Resolution | WIN Legal Advisors",
      description: "Commercial litigation, arbitration, IBC, and regulatory disputes — outcome-focused representation with clear cost budgets.",
    },
  },
};
