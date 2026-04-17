export type Role = "user" | "assistant";

export interface Message {
  role: Role;
  content: string;
}

export type ResponseSource = "canned" | "ai";

export interface RouterResult {
  source: ResponseSource;
  category?: string;
  response?: string;
}

interface WeightedTerm {
  text: string;
  weight: number;
}

interface CategoryConfig {
  response: string;
  phrases: WeightedTerm[];
  keywords: WeightedTerm[];
}

const VETO_PHRASES = [
  "how would you",
  "what do you think",
  "explain",
  "compare",
  "tradeoff",
];

export function isVetoed(input: string): boolean {
  const lower = input.toLowerCase();
  return VETO_PHRASES.some((phrase) => lower.includes(phrase));
}

export const CATEGORIES: Record<string, CategoryConfig> = {
  intro: {
    response:
      "Hafiy Harizan is a software and data engineer based in Perth, Australia, with 4+ years of experience. He specialises in building end-to-end data pipelines, full-stack web applications, and AI-enabled solutions — comfortable across the full stack from React and Next.js on the frontend to Python, SQL, and cloud services on the data and backend layer.",
    phrases: [
      { text: "who is hafiy", weight: 4 },
      { text: "tell me about hafiy", weight: 4 },
      { text: "about hafiy", weight: 3.5 },
      { text: "introduce hafiy", weight: 3 },
    ],
    keywords: [
      { text: "background", weight: 1.5 },
      { text: "overview", weight: 1.5 },
      { text: "introduction", weight: 1.5 },
    ],
  },
  skills: {
    response:
      "Hafiy's strongest technical skill is data engineering — specifically designing and building end-to-end ELT pipelines, scalable data platforms, and automated workflows using Python, SQL, and cloud services. He pairs this with strong full-stack development skills in React, Next.js, and TypeScript, making him equally comfortable building the frontend that consumes the data.",
    phrases: [
      { text: "strongest skill", weight: 4 },
      { text: "technical skill", weight: 4 },
      { text: "best at", weight: 3.5 },
      { text: "what skills", weight: 3 },
      { text: "what can he do", weight: 3 },
    ],
    keywords: [
      { text: "skill", weight: 2 },
      { text: "strongest", weight: 2 },
      { text: "expertise", weight: 1.5 },
      { text: "abilities", weight: 1 },
    ],
  },
  stack: {
    response:
      "Hafiy's core tech stack includes TypeScript, React, and Next.js for frontend; Python, Node.js, and PHP for backend; PostgreSQL, MySQL, and MariaDB for databases; and Docker, GitLab CI/CD, and Linux for DevOps. On the data and AI side he works with Azure AI Studio, Azure OpenAI, Power BI, Tableau, Pandas, and NumPy.",
    phrases: [
      { text: "tech stack", weight: 4.5 },
      { text: "technology stack", weight: 4.5 },
      { text: "what technologies", weight: 3.5 },
      { text: "what tools", weight: 3 },
      { text: "what languages", weight: 3 },
      { text: "what frameworks", weight: 3 },
    ],
    keywords: [
      { text: "stack", weight: 3 },
      { text: "technologies", weight: 2 },
      { text: "tools", weight: 1 },
      { text: "languages", weight: 1 },
      { text: "frameworks", weight: 1 },
    ],
  },
  projects: {
    response:
      "Hafiy has built several personal projects: Salasilah (a family tree and genealogy app using Next.js and D3.js), ChoreJoy (a gamified family chore app with React and Node.js), FridgeBoard (a household organization hub as a PWA), an Expense Tracker with rich analytics dashboards, and ApplyAI — an AI-powered job application assistant. Professionally, his flagship project was DREAM (Data Repository for Exploratory Analysis and Management), a centralised data platform at Telekom Malaysia that reduced data preparation time from hours to minutes.",
    phrases: [
      { text: "personal projects", weight: 4 },
      { text: "what has hafiy built", weight: 4 },
      { text: "tell me about the dream", weight: 4.5 },
      { text: "dream project", weight: 4.5 },
      { text: "what projects", weight: 3 },
      { text: "projects hafiy", weight: 3.5 },
    ],
    keywords: [
      { text: "project", weight: 2 },
      { text: "built", weight: 1.5 },
      { text: "dream", weight: 3 },
      { text: "salasilah", weight: 3 },
      { text: "chorejoy", weight: 3 },
      { text: "fridgeboard", weight: 3 },
      { text: "applyai", weight: 3 },
    ],
  },
  experience: {
    response:
      "Hafiy spent 4+ years at Telekom Malaysia in progressively senior engineering roles — starting as a Trainee, moving to Network Geospatial Viz Solution Engineer, and most recently Visualisation & Software Engineer. His work spanned production data pipeline engineering, geospatial analytics, full-stack development, and integrating ML outputs into analytics platforms processing data from 3M+ customers.",
    phrases: [
      { text: "work experience", weight: 5.5 },
      { text: "where has hafiy worked", weight: 4 },
      { text: "career history", weight: 4 },
      { text: "work history", weight: 4 },
      { text: "telekom malaysia", weight: 4.5 },
      { text: "previous role", weight: 3 },
    ],
    keywords: [
      { text: "experience", weight: 2 },
      { text: "worked", weight: 1.5 },
      { text: "career", weight: 2 },
      { text: "telekom", weight: 3 },
      { text: "role", weight: 0.5 },
    ],
  },
  contact: {
    response:
      "Hafiy is based in Perth, Australia, and is actively seeking new opportunities. You can reach him at hafiyharizan@gmail.com or connect on LinkedIn at linkedin.com/in/hafiyharizan. He's open to discussing roles in software engineering, data engineering, and analytics.",
    phrases: [
      { text: "how to contact", weight: 4.5 },
      { text: "how to reach", weight: 4.5 },
      { text: "get in touch", weight: 4 },
      { text: "contact hafiy", weight: 4.5 },
      { text: "is hafiy available", weight: 4 },
      { text: "open to work", weight: 4 },
    ],
    keywords: [
      { text: "contact", weight: 2.5 },
      { text: "email", weight: 2.5 },
      { text: "reach", weight: 2 },
      { text: "available", weight: 2 },
      { text: "linkedin", weight: 2.5 },
      { text: "availability", weight: 2.5 },
    ],
  },
  hire: {
    response:
      "Hafiy brings 4+ years of hands-on experience building production data pipelines processing millions of records daily. He's automated compliance reporting (100% on-time submissions), designed scalable data mart architectures, and integrated ML outputs into analytics workflows. His unique blend of software engineering and data engineering means he builds robust, maintainable systems — not just scripts.",
    phrases: [
      { text: "why hire hafiy", weight: 4.5 },
      { text: "why should we hire", weight: 4.5 },
      { text: "good fit", weight: 3.5 },
      { text: "what makes hafiy", weight: 3.5 },
      { text: "data engineering role", weight: 3.5 },
    ],
    keywords: [
      { text: "hire", weight: 2 },
      { text: "fit", weight: 1.5 },
      { text: "value", weight: 1 },
      { text: "strength", weight: 1 },
    ],
  },
  recruiter: {
    response:
      "Hafiy is based in Perth, Australia, and is actively looking for software or data engineering roles. He has 4+ years of professional experience and is open to discussing requirements, timelines, and opportunities. The best way to reach him is at hafiyharizan@gmail.com.",
    phrases: [
      { text: "currently looking", weight: 4 },
      { text: "open to opportunities", weight: 4 },
      { text: "notice period", weight: 4.5 },
      { text: "when can he start", weight: 4.5 },
      { text: "salary expectations", weight: 4.5 },
      { text: "working rights", weight: 4.5 },
      { text: "visa status", weight: 4.5 },
      { text: "right to work", weight: 4.5 },
    ],
    keywords: [
      { text: "salary", weight: 3 },
      { text: "notice", weight: 3 },
      { text: "visa", weight: 3 },
      { text: "relocate", weight: 2 },
      { text: "remote", weight: 1 },
      { text: "hybrid", weight: 1 },
    ],
  },
};

const RECRUITER_PREFIXES = [
  "tell me",
  "what is",
  "can you",
  "describe",
  "how has",
  "how can",
];

// Normalize raw score against a cap of 8.
// A score of 8+ raw = 1.0 confidence.
// If a routing test fails (canned case routes to "ai"), increase phrase weights
// for that category — do not change the 0.75 threshold.
function scoreCategory(input: string, config: CategoryConfig): number {
  const lower = input.toLowerCase();
  let raw = 0;

  for (const phrase of config.phrases) {
    if (lower.includes(phrase.text)) raw += phrase.weight;
  }
  for (const kw of config.keywords) {
    if (lower.includes(kw.text)) raw += kw.weight;
  }

  const startsWithRecruiter = RECRUITER_PREFIXES.some((prefix) =>
    lower.trimStart().startsWith(prefix)
  );
  if (startsWithRecruiter) raw *= 1.2;

  if (input.length > 140) raw *= 0.7;
  else if (input.length > 80) raw *= 0.85;

  return Math.min(raw / 8, 1);
}

export function routeQuestion(input: string): RouterResult {
  if (isVetoed(input)) return { source: "ai" };

  const scores = Object.entries(CATEGORIES).map(([category, config]) => ({
    category,
    score: scoreCategory(input, config),
  }));

  scores.sort((a, b) => b.score - a.score);

  const top = scores[0];
  const second = scores[1];

  if (top.score >= 0.75 && top.score - second.score >= 0.15) {
    return {
      source: "canned",
      category: top.category,
      response: CATEGORIES[top.category].response,
    };
  }

  return { source: "ai" };
}
