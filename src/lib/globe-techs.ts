export interface GlobeTech {
  name: string;
  cat: "Frontend" | "Backend" | "Databases" | "DevOps" | "Design" | "Data & Viz" | "Cloud";
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

const awsIcon = svgIcon(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="16" fill="#180f03"/>
  <text x="32" y="34" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="800" fill="#FF9900">AWS</text>
  <path d="M21 43c7 4 16 4 23 0" fill="none" stroke="#FF9900" stroke-width="4" stroke-linecap="round"/>
  <path d="M43 43l4-1.5-1.5 4" fill="none" stroke="#FF9900" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`);

export const GLOBE_TECHS: GlobeTech[] = [
  { name: "JavaScript",  cat: "Frontend",   tier: "core",        icon: "https://cdn.simpleicons.org/javascript/F7DF1E",    color: "#F7DF1E" },
  { name: "TypeScript",  cat: "Frontend",   tier: "core",        icon: "https://cdn.simpleicons.org/typescript/4C8EDA",    color: "#4C8EDA" },
  { name: "React",       cat: "Frontend",   tier: "core",        icon: "https://cdn.simpleicons.org/react/61DAFB",         color: "#61DAFB" },
  { name: "Next.js",     cat: "Frontend",   tier: "core",        icon: "https://cdn.simpleicons.org/nextdotjs/D4D4EE",     color: "#D4D4EE" },
  { name: "Tailwind",    cat: "Frontend",   tier: "core",        icon: "https://cdn.simpleicons.org/tailwindcss/22D3EE",   color: "#22D3EE" },
  { name: "Python",      cat: "Backend",    tier: "core",        icon: "https://cdn.simpleicons.org/python/FFD43B",        color: "#FFD43B" },
  { name: "Node.js",     cat: "Backend",    tier: "comfortable", icon: "https://cdn.simpleicons.org/nodedotjs/74C948",     color: "#74C948" },
  { name: "PostgreSQL",  cat: "Databases",  tier: "comfortable", icon: "https://cdn.simpleicons.org/postgresql/6589E8",   color: "#6589E8" },
  { name: "Docker",      cat: "DevOps",     tier: "comfortable", icon: "https://cdn.simpleicons.org/docker/2496ED",       color: "#2496ED" },
  { name: "GitHub",      cat: "DevOps",     tier: "core",        icon: "https://cdn.simpleicons.org/github/C0C0DC",       color: "#C0C0DC" },
  { name: "Figma",       cat: "Design",     tier: "comfortable", icon: "https://cdn.simpleicons.org/figma/F24E1E",        color: "#F24E1E" },
  { name: "Power BI",    cat: "Data & Viz", tier: "comfortable", icon: powerBiIcon,                                       color: "#F2C811" },
  { name: "AWS",         cat: "Cloud",      tier: "comfortable", icon: awsIcon,                                           color: "#FF9900" },
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
