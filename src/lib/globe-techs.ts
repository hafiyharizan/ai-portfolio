export interface GlobeTech {
  name: string;
  cat: "Frontend" | "Backend" | "Databases" | "DevOps" | "Design" | "Data & Viz" | "Cloud" | "AI & Cloud";
  tier: "core" | "comfortable";
  icon: string;
  color: string;
}

const svgIcon = (svg: string) => `data:image/svg+xml,${encodeURIComponent(svg)}`;

const powerBiIcon = svgIcon(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="16" fill="#1f1a08"/>
  <rect x="13" y="31" width="10" height="20" rx="5" fill="#F2C811"/>
  <rect x="27" y="21" width="10" height="30" rx="5" fill="#F6D84A"/>
  <rect x="41" y="12" width="10" height="39" rx="5" fill="#DDAA01"/>
</svg>`);

const azureIcon = svgIcon(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="16" fill="#001630"/>
  <path d="M13 46 L29 12 H40 L28 34 H42 L51 46 Z" fill="#0078D4"/>
  <path d="M29 12 H40 L51 46 H40 Z" fill="#50B3FF" opacity="0.55"/>
</svg>`);

const claudeIcon = svgIcon(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="16" fill="#1C1917"/>
  <g transform="translate(32,32)" fill="#D97757">
    <rect x="-3.5" y="-23" width="7" height="18" rx="3.5" transform="rotate(0)"/>
    <rect x="-3.5" y="-23" width="7" height="18" rx="3.5" transform="rotate(30)"/>
    <rect x="-3.5" y="-23" width="7" height="18" rx="3.5" transform="rotate(60)"/>
    <rect x="-3.5" y="-23" width="7" height="18" rx="3.5" transform="rotate(90)"/>
    <rect x="-3.5" y="-23" width="7" height="18" rx="3.5" transform="rotate(120)"/>
    <rect x="-3.5" y="-23" width="7" height="18" rx="3.5" transform="rotate(150)"/>
    <rect x="-3.5" y="-23" width="7" height="18" rx="3.5" transform="rotate(180)"/>
    <rect x="-3.5" y="-23" width="7" height="18" rx="3.5" transform="rotate(210)"/>
    <rect x="-3.5" y="-23" width="7" height="18" rx="3.5" transform="rotate(240)"/>
    <rect x="-3.5" y="-23" width="7" height="18" rx="3.5" transform="rotate(270)"/>
    <rect x="-3.5" y="-23" width="7" height="18" rx="3.5" transform="rotate(300)"/>
    <rect x="-3.5" y="-23" width="7" height="18" rx="3.5" transform="rotate(330)"/>
  </g>
</svg>`);

const agenticIcon = svgIcon(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="16" fill="#0d1117"/>
  <circle cx="32" cy="32" r="10" fill="none" stroke="#A78BFA" stroke-width="2.5"/>
  <circle cx="32" cy="14" r="4" fill="#A78BFA"/>
  <circle cx="32" cy="50" r="4" fill="#A78BFA"/>
  <circle cx="14" cy="32" r="4" fill="#A78BFA"/>
  <circle cx="50" cy="32" r="4" fill="#A78BFA"/>
  <line x1="32" y1="18" x2="32" y2="22" stroke="#A78BFA" stroke-width="2"/>
  <line x1="32" y1="42" x2="32" y2="46" stroke="#A78BFA" stroke-width="2"/>
  <line x1="18" y1="32" x2="22" y2="32" stroke="#A78BFA" stroke-width="2"/>
  <line x1="42" y1="32" x2="46" y2="32" stroke="#A78BFA" stroke-width="2"/>
</svg>`);

export const GLOBE_TECHS: GlobeTech[] = [
  { name: "JavaScript",  cat: "Frontend",   tier: "core",        icon: "https://cdn.simpleicons.org/javascript/F7DF1E",        color: "#F7DF1E" },
  { name: "TypeScript",  cat: "Frontend",   tier: "core",        icon: "https://cdn.simpleicons.org/typescript/4C8EDA",        color: "#4C8EDA" },
  { name: "React",       cat: "Frontend",   tier: "core",        icon: "https://cdn.simpleicons.org/react/61DAFB",             color: "#61DAFB" },
  { name: "Next.js",     cat: "Frontend",   tier: "core",        icon: "https://cdn.simpleicons.org/nextdotjs/D4D4EE",         color: "#D4D4EE" },
  { name: "Tailwind",    cat: "Frontend",   tier: "core",        icon: "https://cdn.simpleicons.org/tailwindcss/22D3EE",       color: "#22D3EE" },
  { name: "Python",      cat: "Backend",    tier: "core",        icon: "https://cdn.simpleicons.org/python/FFD43B",            color: "#FFD43B" },
  { name: "Node.js",     cat: "Backend",    tier: "comfortable", icon: "https://cdn.simpleicons.org/nodedotjs/74C948",         color: "#74C948" },
  { name: "PHP",         cat: "Backend",    tier: "core",        icon: "https://cdn.simpleicons.org/php/8892BF",               color: "#8892BF" },
  { name: "PostgreSQL",  cat: "Databases",  tier: "comfortable", icon: "https://cdn.simpleicons.org/postgresql/6589E8",        color: "#6589E8" },
  { name: "Docker",      cat: "DevOps",     tier: "comfortable", icon: "https://cdn.simpleicons.org/docker/2496ED",            color: "#2496ED" },
  { name: "GitHub",      cat: "DevOps",     tier: "core",        icon: "https://cdn.simpleicons.org/github/C0C0DC",            color: "#C0C0DC" },
  { name: "Power BI",    cat: "Data & Viz", tier: "comfortable", icon: powerBiIcon,                                            color: "#F2C811" },
  { name: "Azure",       cat: "Cloud",      tier: "comfortable", icon: azureIcon,                                              color: "#0078D4" },
  { name: "Claude",      cat: "AI & Cloud", tier: "core",        icon: claudeIcon,                                             color: "#D4A853" },
  { name: "Agentic AI",  cat: "AI & Cloud", tier: "core",        icon: agenticIcon,                                            color: "#A78BFA" },
];

/**
 * Fibonacci sphere — returns n evenly-spaced unit vectors as [x, y, z] tuples.
 * Pure function; no Three.js dependency so it's testable in a Node environment.
 */
export function fibSphereUnit(n: number): [number, number, number][] {
  if (n <= 0) return [];
  if (n === 1) return [[0, 1, 0]];
  const pts: [number, number, number][] = [];
  const phi = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y  = 1 - (i / (n - 1)) * 2;
    const rr = Math.sqrt(1 - y * y);
    const t  = phi * i;
    pts.push([Math.cos(t) * rr, y, Math.sin(t) * rr]);
  }
  return pts;
}
