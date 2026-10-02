export const SITE_CONFIG = {
  name: "Hafiy Harizan",
  title: "Hafiy Harizan — Software & Data Engineer",
  description:
    "Perth-based software engineer with 4+ years designing, building and running production data platforms, ETL pipelines and backend services. Currently engineering HR data feeds and analytics at WA Health; previously built platforms processing network data for 3M+ customers at Telekom Malaysia.",
  url: "https://hafiy.dev",
  email: "hafiyharizan@gmail.com",
  phone: "+61 402 565 496",
  location: "Perth, Australia",
  linkedin: "https://www.linkedin.com/in/hafiyharizan/",
  github: "https://github.com/hafiyharizan",
  resumeUrl: "/resume.pdf",
};

export const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Skills", href: "#skills" },
  { label: "Contact", href: "#contact" },
] as const;

export const PERSONAL_PROJECTS = [
  {
    name: "Nayla",
    tagline: "Offline-first Baby Tracker PWA",
    description:
      "A phone-first app for logging feeds, diapers, sleep and wake windows, built for one-handed use at 3am. Vanilla JavaScript with no build step: localStorage is the source of truth, and an optional Postgres/PostgREST backend syncs any number of phones paired by QR code, using server-assigned revisions, tombstone deletes and per-entry merging. Self-hostable with Docker Compose and Caddy, covered by Playwright browser tests, with a Python tool that imports old WhatsApp logs.",
    tags: ["JavaScript", "PWA", "PostgreSQL", "PostgREST", "Docker", "Playwright"],
    icon: "baby",
    color: "#b4683c",
    href: "https://hafiyharizan.github.io/Nayla/",
    repo: "https://github.com/hafiyharizan/Nayla",
    featured: true,
  },
  {
    name: "Salasilah",
    tagline: "Family Tree & Genealogy App",
    description:
      "A modern full-stack web application for building and visualizing family trees. Features intuitive relationship mapping, interactive tree visualization, and a user-centered design that makes genealogy accessible to everyone.",
    tags: ["Next.js", "TypeScript", "PostgreSQL", "D3.js", "Tailwind CSS"],
    icon: "tree",
    color: "#10b981",
    href: "https://salasilah.my/",
    featured: true,
  },
  {
    name: "ChoreQuest",
    tagline: "Gamified Family Chore App",
    description:
      "A playful task management platform that turns household chores into a game. Families earn points, unlock rewards, and build streaks together. Built with engagement loops and reward systems that keep everyone motivated.",
    tags: ["React", "Node.js", "MongoDB", "Framer Motion"],
    icon: "sparkles",
    color: "#f59e0b",
    href: "https://chorequest-nu.vercel.app/",
    featured: true,
  },
  {
    name: "FridgeBoard",
    tagline: "Household Organization Hub",
    description:
      "A shared digital dashboard for families to manage groceries, meal plans, notes, and schedules. Clean UX focused on daily-life utility — the digital equivalent of your fridge door, but smarter.",
    tags: ["Next.js", "Supabase", "Tailwind CSS", "PWA"],
    icon: "layout-dashboard",
    color: "#3b82f6",
    href: "https://fridgeboard.netlify.app/",
    featured: false,
  },
  {
    name: "FishScout",
    tagline: "Fishing Intelligence MVP",
    description:
      "A production-minded MVP for fishing intelligence. Helps anglers discover fishing spots, post catch reports, follow community activity, save promising water, and surface best-time-to-fish insights from recent reports.",
    tags: ["Next.js", "TypeScript", "Supabase", "Tailwind CSS"],
    icon: "fish",
    color: "#06b6d4",
    href: "https://fishos-seven.vercel.app/",
    featured: false,
  },
  {
    name: "ApplySmart AI",
    tagline: "AI-powered Resume & Cover Letter Tailor",
    description:
      "Helps job seekers compare resumes to job descriptions, uncover fit gaps, generate tailored cover letters, prepare for interviews, and track application progress — all in one polished AI workflow.",
    tags: ["Next.js", "TypeScript", "Azure AI", "Tailwind CSS"],
    icon: "sparkles",
    color: "#3b5bdb",
    href: "https://tailor-swift-eight.vercel.app/",
    featured: true,
  },
  {
    name: "Surau Elmina Valley",
    tagline: "Community Mosque Portal",
    description:
      "The community web portal for Surau Elmina Valley in Malaysia, with announcements, bulletins, a photo gallery, FAQs, and pages for the surau's donation fund and volunteer roles. Built to keep the local surau community informed and connected. In Bahasa Malaysia.",
    tags: ["Next.js", "TypeScript", "Tailwind CSS", "Vercel"],
    icon: "building-2",
    color: "#0d9488",
    href: "https://www.surauelminavalley.com/",
    featured: true,
  },
] as const;

export const PROFESSIONAL_PROJECTS = [
  {
    name: "HRPlus Ops",
    fullName: "HRPlus Operations Data Pipeline & Dashboard (WA Health)",
    description:
      "SQL extracts HR service transactions from Oracle into a Power BI data model. Business rules for backlog, queue ageing and service levels are encoded as reusable DAX measures, giving operations leaders one source of truth for form volumes, processing trends and SLA performance.",
    impact: "One source of truth for SLA reporting",
    tags: ["SQL", "Oracle", "Power BI", "DAX", "Data Modelling"],
    icon: "database",
  },
  {
    name: "NurseWest BCP",
    fullName: "NurseWest Business Continuity Automation (WA Health)",
    description:
      "Python automation that extracts, transforms and delivers the data behind NurseWest's business continuity processes. Replaced manual data handling so operational and workforce outputs are produced reliably and on time.",
    impact: "Manual data handling replaced",
    tags: ["Python", "Pandas", "SQL", "Automation"],
    icon: "shield-check",
  },
  {
    name: "DREAM",
    fullName: "Data Repository for Exploratory Analysis and Management",
    description:
      "A central data platform with automated ingestion and preprocessing pipelines behind a Python FastAPI service layer and a Next.js front end. Cut data retrieval from hours to minutes, serving analysts and engineers clean, analysis-ready datasets on demand.",
    impact: "Hours → minutes data retrieval",
    tags: ["Python", "FastAPI", "PostgreSQL", "Next.js", "ETL"],
    icon: "database",
  },
  {
    name: "NDM",
    fullName: "Network Data Mart",
    description:
      "A batch ETL data mart with cron-scheduled pipelines ingesting and transforming millions of records a day into reporting tables. Fully automated reports that operational teams previously built by hand.",
    impact: "Millions of records/day, reports fully automated",
    tags: ["PHP", "JavaScript", "MariaDB", "SQL", "Cron"],
    icon: "server",
  },
  {
    name: "FIVE",
    fullName: "Fibre Infrastructure Visualisation and Enhancement",
    description:
      "A spatial data pipeline that ingests and stores GeoPackage datasets through FME and Bash, feeding ML-based shortest-path routing on a Leaflet web map.",
    impact: "~20% better route-planning accuracy",
    tags: ["FME", "Bash", "PostgreSQL", "GeoServer", "Leaflet.js"],
    icon: "map",
  },
  {
    name: "MSQoS",
    fullName: "Mandatory Standards for Quality of Service",
    description:
      "A regulatory data pipeline for MCMC reporting, with validation checks, monitoring scripts and secure data delivery.",
    impact: "100% on-time submissions, ~50% less manual work",
    tags: ["SQL", "PHP", "Validation", "Monitoring", "Compliance"],
    icon: "shield-check",
  },
] as const;

export const EXPERIENCE = [
  {
    title: "Business Systems Administrator (Data Analyst)",
    company: "Health Support Services, WA Health",
    period: "June 2026 – Present",
    description: [
      "Designing and building a daily data feed that consolidates approved extended leave from three HR systems, so ICT can pause Microsoft 365 licences and park Teams numbers automatically.",
      "Designed the GitHub organisation for a 12-analyst team, including repository structure, topic tagging and Power BI version control with .pbip, and took it from pilot to adoption.",
      "Write SQL against Oracle HR data warehouses and build workforce analytics models covering headcount, FTE, turnover, leave and recruitment.",
      "Automate data preparation, validation and refresh steps with Python, reducing manual handling in recurring reporting.",
      "Build Power BI models and DAX for senior leadership and operational teams.",
    ],
  },
  {
    title: "Visualisation & Software Engineer",
    company: "Telekom Malaysia",
    period: "March 2024 – June 2025",
    description: [
      "Built data platforms in PHP, JavaScript and SQL that processed operational data from 3M+ customers, improving system stability and speeding up enterprise reporting.",
      "Automated data ingestion and validation workflows and integrated machine learning outputs into operational dashboards for network diagnostics.",
      "Applied version control, modular architecture and documentation standards to keep production systems maintainable and secure.",
      "Added validation logic, access controls and monitoring scripts to support high availability and regulatory compliance.",
      "Built real-time infrastructure web apps and dashboards with AmCharts and GeoServer, replacing manual reporting.",
    ],
  },
  {
    title: "Network Geospatial Visualisation Solution Engineer",
    company: "Telekom Malaysia",
    period: "March 2022 – March 2024",
    description: [
      "Automated spatial data processing pipelines with FME and Bash, cutting manual effort for engineering and analytics teams.",
      "Deployed and managed GeoServer services and Tableau Server, providing secure, reliable access for internal users.",
      "Tuned PostgreSQL and MariaDB performance through indexing, query optimisation and schema restructuring for large mapping workloads.",
      "Built geospatial tools and dashboards with Power BI, Tableau and GeoServer for network planning.",
    ],
  },
  {
    title: "Trainee",
    company: "Telekom Malaysia",
    period: "April 2021 – November 2021",
    description: [
      "Supported development of data-driven solutions for infrastructure planning.",
      "Assisted with Python, SQL, and automation tasks improving reporting efficiency.",
      "Built foundational skills in data analytics and cross-functional collaboration.",
    ],
  },
] as const;

export const EDUCATION = [
  {
    degree: "Master's in Data Science",
    school: "Universiti Teknologi MARA (UiTM), Malaysia",
    period: "2021 – 2022",
  },
  {
    degree: "Bachelor of Mechatronics Engineering With Honours",
    school: "Universiti Teknikal Malaysia Melaka (UTeM), Malaysia",
    period: "2015 – 2019",
  },
] as const;

export const CERTIFICATIONS = [
  {
    name: "Microsoft Certified: Azure AI Engineer Associate",
    issuer: "Microsoft",
    period: "Issued March 2026 · Expires March 2027",
  },
] as const;

export const SKILLS = {
  "Languages": [
    "Python", "SQL", "PHP", "JavaScript", "TypeScript", "Bash",
  ],
  "Data": [
    "Pandas", "NumPy", "FME", "Power BI (DAX)", "Tableau",
  ],
  "Databases": [
    "Oracle", "PostgreSQL", "MySQL", "MariaDB",
  ],
  "Backend & Web": [
    "FastAPI", "Node.js", "React", "Next.js", "Leaflet.js", "GeoServer",
  ],
  "DevOps & Cloud": [
    "Docker", "Git", "GitHub", "GitLab CI/CD", "Linux", "Azure (OpenAI, ML)",
  ],
} as const;
