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
      "Hafiy Harizan is a software engineer based in Perth, Australia, with 4+ years designing, building and running production data platforms, ETL pipelines and backend services. He currently works at Health Support Services, WA Health, as a Business Systems Administrator (Data Analyst), building HR data feeds and workforce analytics. Before that he spent four years at Telekom Malaysia building data platforms that processed network data for 3M+ customers. He works mainly in Python, PHP and SQL, with JavaScript and TypeScript front ends.",
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
      "Hafiy's strongest area is data engineering: designing and running ETL pipelines, data platforms and automated validation and reporting workflows in Python, PHP and SQL, on Oracle, PostgreSQL and MariaDB. He also builds the web layer on top, with FastAPI, Node.js, React and Next.js, and ships through Docker and GitLab CI/CD.",
    phrases: [
      { text: "strongest skill", weight: 4 },
      { text: "technical skill", weight: 4 },
      { text: "best at", weight: 3.5 },
      { text: "what skills", weight: 4.5 },
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
      "Hafiy's core stack: Python, SQL, PHP, JavaScript, TypeScript and Bash; Pandas, NumPy, FME, Power BI (DAX) and Tableau for data work; Oracle, PostgreSQL, MySQL and MariaDB for databases; FastAPI, Node.js, React, Next.js, Leaflet.js and GeoServer for backend and web; and Docker, Git, GitLab CI/CD, Linux and Azure (OpenAI, Machine Learning) for DevOps and cloud.",
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
      "Professionally, Hafiy's projects include HRPlus Operations (an Oracle-to-Power BI pipeline for HR service SLAs at WA Health), NurseWest business continuity automation in Python (WA Health), and at Telekom Malaysia: DREAM (a data platform with a FastAPI service layer that cut data retrieval from hours to minutes), NDM (a batch ETL data mart processing millions of records a day), MSQoS (a regulatory reporting pipeline with 100% on-time submissions) and FIVE (a spatial data pipeline for fibre route planning). On the side he has built Salasilah (a family tree app), ChoreQuest (a gamified chore app), FridgeBoard, ApplySmart AI and the Surau Elmina Valley community portal.",
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
      { text: "chorequest", weight: 3 },
      { text: "fridgeboard", weight: 3 },
      { text: "applysmart", weight: 3 },
      { text: "hrplus", weight: 3 },
      { text: "nursewest", weight: 3 },
    ],
  },
  experience: {
    response:
      "Hafiy currently works at Health Support Services, WA Health (June 2026 to present) as a Business Systems Administrator (Data Analyst), building HR data feeds from Oracle, Python automation and Power BI models, and he set up Git-based version control for a 12-analyst team. Before that he was at Telekom Malaysia from 2021 to June 2025: Trainee, then Network Geospatial Visualisation Solution Engineer (2022–2024), then Visualisation & Software Engineer (2024–2025), building data platforms and ETL pipelines that processed network data for 3M+ customers.",
    phrases: [
      { text: "work experience", weight: 5.5 },
      { text: "where has hafiy worked", weight: 4 },
      { text: "career history", weight: 4 },
      { text: "work history", weight: 4 },
      { text: "telekom malaysia", weight: 4.5 },
      { text: "previous role", weight: 3 },
      { text: "where does he work", weight: 6.5 },
      { text: "where does hafiy work", weight: 6.5 },
      { text: "current role", weight: 5.5 },
      { text: "current job", weight: 5.5 },
    ],
    keywords: [
      { text: "experience", weight: 2 },
      { text: "worked", weight: 1.5 },
      { text: "career", weight: 2 },
      { text: "telekom", weight: 3 },
      { text: "wa health", weight: 3 },
      { text: "role", weight: 0.5 },
    ],
  },
  contact: {
    response:
      "Hafiy is based in Perth, Australia. You can reach him at hafiyharizan@gmail.com or on LinkedIn at linkedin.com/in/hafiyharizan. He's interested in mid to senior software engineering roles on data platform teams in Perth.",
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
      "Hafiy brings 4+ years of building and running production data systems. At Telekom Malaysia he built a data mart processing millions of records a day, automated regulatory reporting to 100% on-time submissions with about 50% less manual work, and built a FastAPI data platform that cut data retrieval from hours to minutes. At WA Health he integrates data from multiple HR systems and led a 12-analyst team's move to Git. He cares about clean, maintainable code and reliable automation.",
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
      "Hafiy is based in Perth, Australia, and currently works at WA Health. He's looking for a mid to senior software engineering role on a data platform team and is happy to discuss requirements and timelines. The best way to reach him is at hafiyharizan@gmail.com.",
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
