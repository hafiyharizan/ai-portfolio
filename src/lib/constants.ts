export const SITE_CONFIG = {
  name: "Hafiy Harizan",
  title: "Hafiy Harizan — Software & Data Engineer",
  description:
    "Perth-based software engineer and data & analytics engineer with 4+ years of experience across full stack development, data engineering, analytics platforms, automation, and AI-enabled solutions.",
  url: "https://hafiyharizan.com",
  email: "hafiyharizan@gmail.com",
  phone: "+61 0402565496",
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
      "A community web portal for Surau Elmina Valley — featuring announcements, bulletins, gallery, and an AI-powered guide avatar. Built to keep the local surau community informed and connected.",
    tags: ["Next.js", "TypeScript", "Tailwind CSS", "Supabase"],
    icon: "building-2",
    color: "#0d9488",
    href: "https://www.surauelminavalley.com/",
    featured: true,
  },
] as const;

export const PROFESSIONAL_PROJECTS = [
  {
    name: "DREAM",
    fullName: "Data Repository for Exploratory Analysis and Management",
    description:
      "Designed a centralised data platform with automated ingestion, transformation, and API-based data access. Reduced data preparation time from hours to minutes through automated ELT pipelines.",
    impact: "Hours → Minutes data prep time",
    tags: ["Python", "PostgreSQL", "REST APIs", "ELT", "Power BI"],
    icon: "database",
  },
  {
    name: "NDM",
    fullName: "Network Data Mart",
    description:
      "Built a scalable data mart architecture processing millions of records daily. Implemented fully automated ELT pipelines and scheduled workflows, achieving 100% automated reporting.",
    impact: "80% manual workload removed",
    tags: ["SQL", "Python", "ETL Pipelines", "Scheduling", "Tableau"],
    icon: "server",
  },
  {
    name: "FIVE",
    fullName: "Fiber Infrastructure Visualization and Enhancement",
    description:
      "Developed automated spatial data ingestion pipelines integrating ML-based path optimisation. Enabled analytics and visualisation over nationwide spatial datasets.",
    impact: "20% planning accuracy improvement",
    tags: ["FME", "PostGIS", "GeoServer", "Python", "Leaflet.js"],
    icon: "map",
  },
  {
    name: "MSQoS",
    fullName: "Mandatory Standards for Quality of Service",
    description:
      "Built an automated compliance monitoring system combining validation logic, monitoring scripts, and secure data pipelines. Ensured regulatory compliance with zero missed deadlines.",
    impact: "100% timely submissions, 50% less manual work",
    tags: ["Python", "SQL", "Automation", "Data Quality", "Monitoring"],
    icon: "shield-check",
  },
] as const;

export const EXPERIENCE = [
  {
    title: "Visualization & Software Engineer",
    company: "Telekom Malaysia",
    period: "March 2024 – June 2025",
    description: [
      "Designed, built, and supported production-grade data pipelines and analytics platforms processing datasets from 3M+ customers.",
      "Implemented automated data ingestion, transformation (ELT), and validation workflows.",
      "Developed scalable backend services using Python, PHP, SQL, and REST APIs.",
      "Integrated machine learning outputs into data pipelines supporting AI-driven analytics.",
      "Applied DataOps and DevOps practices including CI/CD pipelines and containerisation.",
    ],
  },
  {
    title: "Network Geospatial Viz Solution Engineer",
    company: "Telekom Malaysia",
    period: "March 2022 – March 2024",
    description: [
      "Built and optimised cloud-ready analytics datasets and spatial data pipelines.",
      "Designed and maintained high-performance databases with indexing and query optimisation.",
      "Automated complex data transformation and orchestration workflows.",
      "Delivered production dashboards in Power BI and Tableau.",
      "Deployed and supported analytics services including GeoServer and Tableau Server.",
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

export const SKILLS = {
  "Frontend": [
    "JavaScript", "TypeScript", "React", "Next.js", "HTML", "CSS", "Tailwind CSS", "Bootstrap",
  ],
  "Backend": [
    "Node.js", "Python", "PHP", "RESTful APIs", "API Integration",
  ],
  "Databases": [
    "PostgreSQL", "MySQL", "MariaDB", "Query Optimization", "Data Modelling", "ELT",
  ],
  "AI & Cloud": [
    "Azure AI Studio", "Azure OpenAI", "Azure ML", "Prompt Engineering", "Model Deployment", "Agentic AI",
  ],
  "Data & Viz": [
    "Power BI", "Tableau", "Leaflet.js", "AmCharts", "Pandas", "NumPy",
  ],
  "DevOps & Tools": [
    "Docker", "Git", "GitHub", "GitLab CI/CD", "Linux CLI", "Agile/Scrum",
  ],
} as const;

export const TESTIMONIALS = [
  {
    quote:
      "Hafiy consistently delivered high-quality data solutions that exceeded expectations. His ability to translate complex business requirements into robust technical implementations was impressive.",
    name: "Placeholder Name",
    title: "Team Lead, Telekom Malaysia",
    avatar: null,
  },
  {
    quote:
      "A rare engineer who understands both the data pipeline and the end-user experience. Hafiy's work on our analytics platform significantly improved our decision-making speed.",
    name: "Placeholder Name",
    title: "Senior Manager, Data Analytics",
    avatar: null,
  },
  {
    quote:
      "Hafiy brought a unique blend of engineering rigour and creative problem-solving to every project. His automated pipelines saved us countless hours of manual work.",
    name: "Placeholder Name",
    title: "Project Manager, Infrastructure",
    avatar: null,
  },
] as const;
