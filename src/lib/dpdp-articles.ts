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
    readTime: "6 min read",
    category: "DPDP Act",
    tags: ["Overview", "Founders", "Compliance"],
    excerpt:
      "A plain-English walkthrough of India's Digital Personal Data Protection Act — who it applies to, what changes, and what founders must do first.",
    sections: [
      {
        id: "what-is-dpdp",
        heading: "What is the DPDP Act?",
        paragraphs: [
          "The Digital Personal Data Protection Act, 2023 (DPDP Act) is India's first comprehensive data protection law. It applies to any business — Indian or foreign — that processes the digital personal data of individuals in India.",
        ],
      },
      {
        id: "consent-first-regime",
        heading: "A Consent-First Regime",
        paragraphs: [
          "At its core, the Act introduces a consent-first regime. Businesses (called 'Data Fiduciaries') must obtain clear, informed and specific consent before processing personal data.",
          "Data Principals — the individuals whose data is processed — must be able to access, correct, erase and raise grievances about their data.",
        ],
      },
      {
        id: "founder-priorities",
        heading: "Immediate Priorities for Founders",
        paragraphs: [
          "The immediate priorities are: (1) mapping what personal data you collect and why, (2) refreshing your privacy notice and consent flows, (3) appointing a grievance officer, and (4) putting a breach-response playbook in place.",
          "Penalties can reach ₹250 crore per instance — compliance is a board-level concern, not an IT ticket.",
        ],
      },
    ],
  },
  {
    slug: "consent-notice-checklist",
    title: "DPDP Consent & Notice: A Practical Checklist",
    date: "March 18, 2025",
    readTime: "5 min read",
    category: "DPDP Act",
    tags: ["Consent", "Notice", "Checklist"],
    excerpt:
      "How to draft a DPDP-compliant notice and consent flow — with the seven elements every notice must contain.",
    sections: [
      {
        id: "notice-requirements",
        heading: "Notice Requirements Under Section 5",
        paragraphs: [
          "Under Section 5 of the DPDP Act, every notice served to a Data Principal must be clear, in plain language, and available in English plus any of the 22 languages listed in the Eighth Schedule.",
        ],
      },
      {
        id: "elements-of-notice",
        heading: "Seven Elements Every Notice Must Contain",
        paragraphs: [
          "A compliant notice must state: the personal data being collected, the specific purpose, the manner of exercising rights, the grievance redressal mechanism, and the way to withdraw consent.",
          "Consent must be free, specific, informed, unconditional and unambiguous — bundled consents and pre-ticked boxes are non-starters.",
        ],
      },
      {
        id: "practical-tips",
        heading: "Practical Implementation Tips",
        paragraphs: [
          "Separate marketing consent from service consent, and log the exact notice version each user consented to. Regulators will ask for this trail.",
        ],
      },
    ],
  },
  {
    slug: "data-principal-rights",
    title: "Rights of Data Principals — And How to Honour Them",
    date: "March 25, 2025",
    readTime: "4 min read",
    category: "DPDP Act",
    tags: ["Rights", "Operations"],
    excerpt:
      "Access, correction, erasure, grievance redressal and nomination — what each right means and the SLAs you should design for.",
    sections: [
      {
        id: "the-five-rights",
        heading: "The Five Key Rights",
        paragraphs: [
          "The DPDP Act grants Data Principals five key rights: right to information about processing, right to correction and erasure, right to grievance redressal, right to nominate, and the right to withdraw consent as easily as it was given.",
        ],
      },
      {
        id: "operational-slas",
        heading: "Operational SLAs",
        paragraphs: [
          "You need a user-facing rights portal (or email intake) with acknowledged turnaround times.",
          "We recommend an internal SLA of 7 days for access requests and 30 days for erasure requests, with an audit log for every action.",
        ],
      },
      {
        id: "refusing-requests",
        heading: "Refusing a Request",
        paragraphs: [
          "If you refuse a request, you must give reasons in writing, and the Data Principal can escalate to the Data Protection Board of India.",
        ],
      },
    ],
  },
  {
    slug: "cross-border-transfers",
    title: "Cross-Border Data Transfers Under the DPDP Act",
    date: "April 2, 2025",
    readTime: "5 min read",
    category: "DPDP Act",
    tags: ["Cross-Border", "Transfers", "Localisation"],
    excerpt:
      "The DPDP Act flips the model — transfers are allowed by default, except to notified 'negative-list' countries. Here's how to prepare.",
    sections: [
      {
        id: "negative-list-model",
        heading: "The Negative-List Model",
        paragraphs: [
          "Unlike the GDPR, the DPDP Act adopts a negative-list approach: cross-border transfers are permitted unless the Central Government notifies a specific country as restricted.",
        ],
      },
      {
        id: "sectoral-overlays",
        heading: "Sectoral Localisation Overlays",
        paragraphs: [
          "Sectoral regulators (RBI, IRDAI, SEBI) continue to impose data localisation on regulated entities.",
          "Your inter-company data-sharing agreements, standard contractual clauses and vendor DPAs should reference both the DPDP Act and applicable sectoral rules.",
        ],
      },
      {
        id: "transfer-register",
        heading: "Maintain a Transfer Register",
        paragraphs: [
          "Maintain a live 'data transfer register' showing every third-party processor, its location, the categories of data shared, and the safeguards in place.",
        ],
      },
    ],
  },
  {
    slug: "breach-response",
    title: "Personal Data Breaches: A 72-Hour Playbook",
    date: "April 9, 2025",
    readTime: "6 min read",
    category: "DPDP Act",
    tags: ["Breach", "Incident Response"],
    excerpt:
      "Every Data Fiduciary must notify the Data Protection Board and affected Data Principals of a breach. Here's the workflow to build now.",
    sections: [
      {
        id: "notification-duty",
        heading: "The Notification Duty",
        paragraphs: [
          "The DPDP Act requires prompt notification of personal data breaches to both the Data Protection Board of India and each affected Data Principal — regardless of severity.",
        ],
      },
      {
        id: "playbook-workflow",
        heading: "Playbook Workflow",
        paragraphs: [
          "Build a breach-response playbook that covers detection, containment, forensic assessment, regulator notification, user communication and post-incident review.",
          "Assign named owners and rehearse it at least twice a year.",
        ],
      },
      {
        id: "notification-content",
        heading: "What to Include in the Notification",
        paragraphs: [
          "Notification content should include the nature of the breach, categories and approximate number of records affected, likely consequences, mitigation measures taken, and the point of contact for further information.",
        ],
      },
    ],
  },
  {
    slug: "significant-data-fiduciary",
    title: "Are You a Significant Data Fiduciary?",
    date: "April 16, 2025",
    readTime: "4 min read",
    category: "DPDP Act",
    tags: ["SDF", "Governance"],
    excerpt:
      "The government can designate companies as SDFs based on volume, sensitivity and risk — triggering additional obligations. Understand the threshold.",
    sections: [
      {
        id: "sdf-obligations",
        heading: "Heightened SDF Obligations",
        paragraphs: [
          "A Significant Data Fiduciary (SDF) faces heightened obligations: appointment of a Data Protection Officer based in India, an independent data auditor, periodic Data Protection Impact Assessments, and independent audits.",
        ],
      },
      {
        id: "designation-factors",
        heading: "Designation Factors",
        paragraphs: [
          "Designation is based on factors including the volume and sensitivity of data processed, risk to Data Principal rights, potential impact on India's sovereignty and public order, and risk to electoral democracy.",
        ],
      },
      {
        id: "adopt-early",
        heading: "Why Adopt SDF-Grade Governance Early",
        paragraphs: [
          "Even if you aren't formally designated, adopting SDF-grade governance early is a strong signal to investors, enterprise buyers and regulators. It's also cheaper than retrofitting later.",
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
