export type ArticleSection = {
  id: string;
  heading: string;
  paragraphs: string[];
};

export type DpdpArticle = {
  slug: string;
  title: string;
  date: string;
  readTime: string;
  category: string;
  tags: string[];
  excerpt: string;
  sections: ArticleSection[];
};

export const dpdpArticles: DpdpArticle[] = [
  {
    slug: "dpdp-act-overview",
    title: "The DPDP Act 2023: A Founder's Overview",
    date: "March 12, 2025",
    readTime: "9 min read",
    category: "DPDP Act",
    tags: ["Overview", "Founders", "Compliance"],
    excerpt:
      "A plain-English walkthrough of India's Digital Personal Data Protection Act — who it applies to, what changes, and what founders must do first.",
    sections: [
      {
        id: "what-is-dpdp",
        heading: "What is the DPDP Act?",
        paragraphs: [
          "The Digital Personal Data Protection Act, 2023 (DPDP Act) is India's first comprehensive, horizontal data protection law. Enacted in August 2023 after nearly six years of legislative iteration — from the Justice Srikrishna Committee report to the withdrawn 2019 Bill — it establishes a single framework governing how digital personal data of individuals in India may be collected, stored, used and shared.",
          "The Act applies to any business — Indian or foreign — that processes the digital personal data of individuals located in India, whether that data is collected online or digitised after being collected offline. Extra-territorial reach is explicit: an overseas SaaS company selling to Indian consumers is squarely within scope, regardless of where its servers sit.",
          "Certain narrow exemptions apply — for purely personal or domestic use, publicly available data made public by the individual themselves, and specified research or statistical processing — but every consumer-facing business, employer and B2B platform handling contact data will fall within the Act's regime.",
        ],
      },
      {
        id: "consent-first-regime",
        heading: "A Consent-First Regime",
        paragraphs: [
          "At its core, the Act introduces a consent-first regime. Businesses — called 'Data Fiduciaries' — must obtain free, specific, informed, unconditional and unambiguous consent before processing personal data, and that consent must be as easy to withdraw as it was to give.",
          "The only alternative lawful basis is a narrowly-defined set of 'legitimate uses': voluntary sharing by the individual for a specified purpose, employment-related processing, compliance with a court order or Indian law, medical emergencies, disasters, and certain State functions. There is no broad 'legitimate interest' ground of the sort GDPR provides — a critical difference founders often miss.",
          "Data Principals — the individuals whose data is processed — must be able to access, correct, erase and raise grievances about their data, and to nominate another person to exercise these rights on their behalf in the event of death or incapacity.",
        ],
      },
      {
        id: "founder-priorities",
        heading: "Immediate Priorities for Founders",
        paragraphs: [
          "The immediate priorities for any founder are fourfold. First, map every touchpoint where personal data is collected — website forms, mobile apps, CRM imports, HR systems, vendor tools — and record the purpose, retention period and downstream processors for each.",
          "Second, refresh your privacy notice and consent flows so they meet Section 5's plain-language, itemised requirements, and rebuild your cookie banners and signup forms to capture granular, unbundled consent.",
          "Third, appoint a Data Protection Officer or grievance officer whose contact details are prominently published, and stand up a rights-request intake mechanism with defined SLAs.",
          "Fourth, put a breach-response playbook in place. Notification to the Data Protection Board is mandatory for every personal data breach — there is no severity threshold — and rehearsed workflows make the difference between a controlled disclosure and a regulatory escalation.",
          "Penalties under Schedule 1 can reach ₹250 crore per instance for failure to secure personal data, ₹200 crore for failure to notify a breach, and ₹150 crore for breaches of children's data obligations. Compliance is a board-level concern, not an IT ticket.",
        ],
      },
      {
        id: "how-we-help",
        heading: "How WIN Legal Advisors Can Help",
        paragraphs: [
          "We run a fixed-scope DPDP Readiness Assessment that produces a data map, gap analysis against the Act and draft Rules, refreshed notices and consent flows, a breach-response playbook and a board-ready compliance roadmap — typically within four to six weeks.",
          "Book a consultation to scope your organisation's exposure and build a defensible compliance posture before enforcement begins.",
        ],
      },
    ],
  },
  {
    slug: "consent-notice-checklist",
    title: "DPDP Consent & Notice: A Practical Checklist",
    date: "March 18, 2025",
    readTime: "8 min read",
    category: "DPDP Act",
    tags: ["Consent", "Notice", "Checklist"],
    excerpt:
      "How to draft a DPDP-compliant notice and consent flow — with the seven elements every notice must contain.",
    sections: [
      {
        id: "notice-requirements",
        heading: "Notice Requirements Under Section 5",
        paragraphs: [
          "Section 5 of the DPDP Act requires every Data Fiduciary to serve a notice on the Data Principal at or before the point of collecting personal data. The notice must be independent of any other document, written in clear and plain language, and available in English plus any of the 22 languages listed in the Eighth Schedule to the Constitution — at the Data Principal's option.",
          "This 'itemised notice' obligation displaces the older practice of burying data collection disclosures inside a 40-page terms document. A checkbox that says 'I agree to the Terms and Privacy Policy' will not, on its own, discharge the notice obligation for new data collection.",
        ],
      },
      {
        id: "elements-of-notice",
        heading: "Seven Elements Every Notice Must Contain",
        paragraphs: [
          "A compliant notice must clearly state: (1) the personal data proposed to be processed, itemised by category; (2) the specific purpose for each category; (3) the manner in which the Data Principal may exercise their rights of access, correction, erasure and grievance; (4) the manner of withdrawing consent, which must be as easy as giving it; (5) the manner of making a complaint to the Data Protection Board of India; (6) contact details of the Data Protection Officer or authorised person; and (7) where consent was previously obtained before the Act, a fresh notice at the earliest opportunity.",
          "Consent itself must be free, specific, informed, unconditional and unambiguous — bundled consents, pre-ticked boxes, or making service delivery contingent on consent for unrelated processing are all non-starters. If a user cannot use the core service without consenting to marketing analytics, that consent is not 'free' and will not stand up to regulatory challenge.",
        ],
      },
      {
        id: "practical-tips",
        heading: "Practical Implementation Tips",
        paragraphs: [
          "Separate marketing consent from service consent, and separate each optional processing purpose from every other. A signup form should show three or four distinct toggles — service delivery (implied by account creation), transactional communications, marketing communications, product analytics — each with its own micro-notice.",
          "Log the exact notice version each user consented to, along with a timestamp, IP address and consent artefact. Regulators and consumer courts will ask for this trail, and the burden of proof under Section 6(1) sits squarely with the Data Fiduciary.",
          "Publish notices in at least English and Hindi at launch, and add regional languages based on your user base. A Marathi-speaking user in Pune has an explicit statutory right to receive the notice in Marathi on request.",
          "Rebuild your cookie banner. A single 'Accept All / Reject All / Manage' pattern with granular categories — strictly necessary, functional, analytics, marketing — is now the minimum defensible baseline, and 'reject' must be as prominent and one-click as 'accept'.",
        ],
      },
      {
        id: "checklist",
        heading: "The Ten-Point Notice & Consent Checklist",
        paragraphs: [
          "Use this list before you ship any change to a signup, cookie banner or marketing form:",
          "1. Notice is separate from Terms and Privacy Policy. 2. Data categories are itemised. 3. Purposes are specific and matched to categories. 4. Rights and grievance mechanism are explained inline. 5. Withdrawal is one click. 6. Language toggle covers English plus your top three regional languages. 7. Consent is granular and unbundled. 8. No pre-ticked boxes. 9. Consent artefact (version, timestamp, IP, user ID) is logged and retrievable. 10. A DPO or grievance officer's email is displayed with a 30-day response SLA.",
        ],
      },
    ],
  },
  {
    slug: "data-principal-rights",
    title: "Rights of Data Principals — And How to Honour Them",
    date: "March 25, 2025",
    readTime: "7 min read",
    category: "DPDP Act",
    tags: ["Rights", "Operations"],
    excerpt:
      "Access, correction, erasure, grievance redressal and nomination — what each right means and the SLAs you should design for.",
    sections: [
      {
        id: "the-five-rights",
        heading: "The Five Key Rights",
        paragraphs: [
          "Chapter III of the DPDP Act grants Data Principals five substantive rights. The right to information (Section 11) allows them to obtain a summary of the personal data being processed, the processing activities undertaken, and the identities of other Data Fiduciaries and Processors with whom the data has been shared.",
          "The right to correction and erasure (Section 12) requires Data Fiduciaries to correct inaccurate or misleading data, complete incomplete data, update outdated data, and erase data that is no longer necessary for the purpose for which it was collected — unless retention is required by law.",
          "The right to grievance redressal (Section 13) obliges every Data Fiduciary to provide a readily-available mechanism for complaints, and to respond within a period to be prescribed by the Rules (currently expected to be 30 days).",
          "The right of nomination (Section 14) permits a Data Principal to nominate another person to exercise their rights in the event of death or incapacity — a novel provision without direct GDPR parallel.",
          "The right to withdraw consent (Section 6(4)) must be exercisable as easily as consent was given, and withdrawal must not affect the lawfulness of processing done before withdrawal.",
        ],
      },
      {
        id: "operational-slas",
        heading: "Operational SLAs and Tooling",
        paragraphs: [
          "You need a user-facing rights portal — or, at minimum, a monitored email intake — with published turnaround times. We recommend an internal SLA of 7 days for access requests, 14 days for correction requests, and 30 days for erasure and grievance requests, with an audit log capturing every action taken.",
          "Build a lightweight case-management workflow: intake → identity verification → routing to data owner → action → response to Data Principal → closure log. Identity verification is often overlooked but is essential: honouring an erasure request from an imposter is itself a personal data breach.",
          "Instrument your systems so that a single 'delete user X' command propagates across production databases, analytics warehouses, marketing tools, backup snapshots and third-party processors. Manual erasure across a fragmented stack is where most compliance programmes fail an audit.",
        ],
      },
      {
        id: "refusing-requests",
        heading: "Refusing or Restricting a Request",
        paragraphs: [
          "Not every request must be honoured. The Act and forthcoming Rules permit refusal or partial fulfilment where the request is manifestly unfounded or excessive, where erasure would violate a legal retention obligation (tax, KYC, employment records), or where disclosure would infringe another person's rights.",
          "Where you refuse, you must give reasons in writing, cite the specific ground, and inform the Data Principal of their right to escalate to the Data Protection Board of India. A silent refusal — or a template 'we cannot process this request' response — is itself a breach of the grievance-redressal obligation and invites regulatory attention.",
          "Duty of the Data Principal (Section 15) is also enforceable: false or frivolous complaints can attract penalties up to ₹10,000. In genuinely abusive cases, document the pattern and cite Section 15 in your refusal.",
        ],
      },
    ],
  },
  {
    slug: "cross-border-transfers",
    title: "Cross-Border Data Transfers Under the DPDP Act",
    date: "April 2, 2025",
    readTime: "8 min read",
    category: "DPDP Act",
    tags: ["Cross-Border", "Transfers", "Localisation"],
    excerpt:
      "The DPDP Act flips the model — transfers are allowed by default, except to notified 'negative-list' countries. Here's how to prepare.",
    sections: [
      {
        id: "negative-list-model",
        heading: "The Negative-List Model",
        paragraphs: [
          "Section 16 of the DPDP Act takes a strikingly permissive approach to cross-border data transfers. Unlike GDPR, which prohibits transfers unless adequacy, standard contractual clauses or binding corporate rules apply, the DPDP Act permits transfers to any country by default — except those the Central Government specifically notifies as restricted.",
          "As of publication, no country has been placed on the negative list, meaning transfers to the United States, European Union, Singapore, United Kingdom and elsewhere are permitted without additional formalities under the DPDP Act itself. This is likely to be temporary; a notified list is widely expected during 2025-26.",
        ],
      },
      {
        id: "sectoral-overlays",
        heading: "Sectoral Localisation Overlays",
        paragraphs: [
          "The permissive DPDP position does not displace sector-specific data localisation. The Reserve Bank of India's 2018 directive requires payment system data to be stored only in India. IRDAI mandates that insurance policyholder data be maintained in India. SEBI's cloud framework restricts where regulated entities may host trading and demat data.",
          "MeitY's earlier draft e-commerce rules and the CERT-In 2022 directions on log retention add further overlays. A financial services or health-tech company must therefore reconcile the DPDP Act's permissive default with the stricter sectoral position — and where they conflict, the sectoral rule prevails.",
          "Your inter-company data-sharing agreements, standard contractual clauses and vendor DPAs should reference both the DPDP Act and the applicable sectoral rules, and should include audit-right, sub-processor notification and breach-notification clauses that satisfy both regimes.",
        ],
      },
      {
        id: "transfer-register",
        heading: "Maintain a Live Transfer Register",
        paragraphs: [
          "Best practice — and, we anticipate, forthcoming Rules requirement — is to maintain a live 'data transfer register' listing every third-party processor and sub-processor, its physical processing location, the categories of personal data shared, the lawful basis, the contractual safeguards in place, and the date of the last vendor risk assessment.",
          "For a typical SaaS business the register will include cloud infrastructure (AWS, GCP, Azure regions), CRM (Salesforce, HubSpot), analytics (Mixpanel, Amplitude), email (SendGrid, Postmark), support (Zendesk, Intercom), and payment (Stripe, Razorpay). Each row should be reviewed at least annually and whenever a vendor is added, removed or changes its processing location.",
        ],
      },
      {
        id: "practical-steps",
        heading: "Practical Steps to Take Now",
        paragraphs: [
          "Run a vendor inventory this quarter. Update your Data Processing Agreements to reflect the DPDP Act's definitions and to bind sub-processors to equivalent obligations. Flag any transfers into jurisdictions likely to appear on a future negative list — historically these are countries where India has strategic security concerns — and design a fallback processing location for each.",
          "If you are a Significant Data Fiduciary or expect designation, plan for an Indian primary or hot-standby region for regulated data categories.",
        ],
      },
    ],
  },
  {
    slug: "breach-response",
    title: "Personal Data Breaches: A 72-Hour Playbook",
    date: "April 9, 2025",
    readTime: "9 min read",
    category: "DPDP Act",
    tags: ["Breach", "Incident Response"],
    excerpt:
      "Every Data Fiduciary must notify the Data Protection Board and affected Data Principals of a breach. Here's the workflow to build now.",
    sections: [
      {
        id: "notification-duty",
        heading: "The Notification Duty",
        paragraphs: [
          "Section 8(6) of the DPDP Act requires prompt notification of every personal data breach to both the Data Protection Board of India and each affected Data Principal. Critically — and unlike GDPR — there is no severity or risk-of-harm threshold. Any unauthorised processing, accidental disclosure, alteration, loss, destruction or loss of access to personal data triggers the duty.",
          "The precise notification timeline will be set by the DPDP Rules, but the draft Rules published in January 2025 propose an initial notification 'without delay' and a detailed follow-up within 72 hours — mirroring GDPR's Article 33 timeline and CERT-In's 6-hour cybersecurity incident reporting requirement.",
          "In parallel, CERT-In's 2022 directions require notification of specified cyber incidents within 6 hours. For a breach that is both a personal data breach and a reportable cyber incident, both timelines run concurrently.",
        ],
      },
      {
        id: "playbook-workflow",
        heading: "The 72-Hour Playbook Workflow",
        paragraphs: [
          "A rehearsed playbook is the single highest-leverage investment a founder can make. The workflow should cover six stages: detection, containment, forensic assessment, regulator notification, user communication and post-incident review.",
          "Detection: SIEM alerts, employee reports, third-party disclosure, and public disclosure (a security researcher's tweet is the modern equivalent of a subpoena). Assign a 24/7 on-call rotation with escalation to a named Incident Commander.",
          "Containment: isolate the affected system, rotate credentials, revoke tokens, and preserve forensic evidence. Do not power down machines that may hold volatile memory forensic value.",
          "Forensic assessment: within 24 hours, produce a written brief covering root cause, data categories affected, number of Data Principals affected, geographic spread and downstream exposure.",
          "Regulator notification: file the initial notice to the Data Protection Board on the prescribed portal, and to CERT-In where applicable, within statutory timelines. Do not wait for perfect information; file what you know and update.",
          "User communication: notify affected Data Principals directly (in-app, email, SMS) with clear language on what happened, what data was affected, what you are doing, and what they can do (password reset, credit monitoring, phishing awareness).",
          "Post-incident review: within 30 days conduct a blameless post-mortem, log lessons learned, and update the playbook. Regulators and enterprise customers will ask to see the post-mortem.",
        ],
      },
      {
        id: "notification-content",
        heading: "What to Include in the Notification",
        paragraphs: [
          "The notification to the Data Protection Board should include: the nature and circumstances of the breach; the categories and approximate number of Data Principals and records affected; the likely consequences; the mitigation measures taken and proposed; and a named point of contact.",
          "The notification to affected Data Principals should be in clear, plain language and cover: what happened, what data was involved, what you are doing about it, what they should do, and how to contact you or your DPO. Avoid legalistic hedging — regulators and users read defensiveness as an admission of poor governance.",
        ],
      },
      {
        id: "prepare-now",
        heading: "Prepare Before You Need It",
        paragraphs: [
          "Rehearse the playbook at least twice a year with a tabletop exercise involving engineering, security, legal, communications and executive leadership. Pre-draft template notices for the Board, for users and for the press. Pre-select a forensic vendor and a crisis communications firm on retainer so procurement is not on the critical path.",
          "A well-managed breach is a survivable event; a badly-managed one has ended companies. The difference is preparation.",
        ],
      },
    ],
  },
  {
    slug: "significant-data-fiduciary",
    title: "Are You a Significant Data Fiduciary?",
    date: "April 16, 2025",
    readTime: "7 min read",
    category: "DPDP Act",
    tags: ["SDF", "Governance"],
    excerpt:
      "The government can designate companies as SDFs based on volume, sensitivity and risk — triggering additional obligations. Understand the threshold.",
    sections: [
      {
        id: "sdf-obligations",
        heading: "Heightened SDF Obligations",
        paragraphs: [
          "Section 10 of the DPDP Act empowers the Central Government to designate any Data Fiduciary — or class of Data Fiduciaries — as a Significant Data Fiduciary (SDF). Designation triggers four additional, non-trivial obligations.",
          "First, appointment of a Data Protection Officer based in India, who is an employee of the SDF and reports to the board or a designated director. This is a full-time senior role, not a hat worn by the general counsel.",
          "Second, appointment of an independent Data Auditor to evaluate compliance with the Act, with results reportable to the Board.",
          "Third, periodic Data Protection Impact Assessments for any new processing activity that presents elevated risk to Data Principals.",
          "Fourth, periodic independent audits, algorithmic-fairness assessments where automated decision-making is used at scale, and any other measures the Central Government notifies.",
        ],
      },
      {
        id: "designation-factors",
        heading: "Designation Factors",
        paragraphs: [
          "Designation is discretionary and is based on factors listed in Section 10(1): the volume and sensitivity of personal data processed; the risk to the rights of Data Principals; the potential impact on the sovereignty and integrity of India; risk to electoral democracy; security of the State; and public order.",
          "In practice, early designations are likely to target large consumer internet platforms, telecom operators, financial services (banks, NBFCs, PA/PGs, wallets), health-tech, ed-tech with large minor user bases, and AI/ML platforms doing large-scale automated decision-making. Any business processing more than a few million Indian users' data should assume it is a candidate.",
        ],
      },
      {
        id: "adopt-early",
        heading: "Why Adopt SDF-Grade Governance Early",
        paragraphs: [
          "Even without formal designation, adopting SDF-grade governance early is a strong signal to investors, enterprise buyers and regulators. A named DPO, a documented DPIA process, and an annual independent audit — mapped to ISO 27701 or BS 10012 — are increasingly baseline requirements in enterprise procurement checklists and Series B+ diligence.",
          "It is also materially cheaper than retrofitting. Building consent, rights-handling and audit trails into your data platform in the first two years costs a fraction of untangling a mature but non-compliant stack under regulator pressure.",
          "If you receive a designation notice, you typically have a 90-day implementation window. Use the intervening months to run a mock designation exercise and identify gaps.",
        ],
      },
      {
        id: "board-agenda",
        heading: "Putting DPDP on the Board Agenda",
        paragraphs: [
          "Quarterly board reporting should cover: personal data inventory changes, rights requests received and resolved, breaches and near-misses, vendor risk assessments completed, DPIA outcomes, training completion rates, and regulatory correspondence. This structure works whether you are an SDF or aspiring to that standard.",
          "We help boards build this reporting cadence and act as an outsourced DPO for early-stage companies not yet ready to hire full-time. Book a consultation to discuss what a right-sized programme looks like for your business.",
        ],
      },
    ],
  },
];

export function getDpdpArticle(slug: string): DpdpArticle | undefined {
  return dpdpArticles.find((a) => a.slug === slug);
}

export const dpdpCategories = Array.from(
  new Set(dpdpArticles.flatMap((a) => a.tags)),
).sort();
