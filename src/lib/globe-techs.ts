export interface GlobeTech {
  name: string;
  cat: string;
  tier: "core" | "comfortable";
  icon: string;
  color: string;
}

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
  { name: "Power BI",    cat: "Data & Viz", tier: "comfortable", icon: "https://cdn.simpleicons.org/powerbi/F2C811",      color: "#F2C811" },
  { name: "AWS",         cat: "Cloud",      tier: "comfortable", icon: "https://cdn.simpleicons.org/amazonaws/FF9900",    color: "#FF9900" },
];

/**
 * Fibonacci sphere — returns n evenly-spaced unit vectors as [x, y, z] tuples.
 * Pure function; no Three.js dependency so it's testable in a Node environment.
 */
export function fibSphereUnit(n: number): [number, number, number][] {
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
