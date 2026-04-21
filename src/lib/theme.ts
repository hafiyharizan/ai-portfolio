export const THEME_STORAGE_KEY = "hafiy-theme";
export const DEFAULT_THEME = "forest-green" as const;

export const THEMES = [
  { name: "forest-green",    label: "Ember",  accent: "#d97b42", accentHot: "#e8963a", hue: 31  },
  { name: "electric-purple", label: "Purple", accent: "#cd83ff", accentHot: "#ff6fdc", hue: 308 },
  { name: "electric-green",  label: "Neon",   accent: "#00ec43", accentHot: "#00fc5f", hue: 145 },
] as const;

export type ThemeName = (typeof THEMES)[number]["name"];

export const THEME_NAMES = THEMES.map((t) => t.name);

export function isThemeName(value: string): value is ThemeName {
  return THEMES.some((t) => t.name === value);
}

export function applyCustomHue(hue: number) {
  const root = document.documentElement;
  const h = Math.round(hue);
  const hh = (h + 15) % 360;
  root.style.setProperty("--accent",       `oklch(0.72 0.18 ${h})`);
  root.style.setProperty("--accent-light", `oklch(0.78 0.16 ${h})`);
  root.style.setProperty("--accent-hot",   `oklch(0.76 0.22 ${hh})`);
  root.style.setProperty("--accent-soft",  `oklch(0.72 0.18 ${h} / 0.16)`);
  root.style.setProperty("--accent-line",  `oklch(0.72 0.18 ${h} / 0.42)`);
  root.style.setProperty("--accent-glow",  `oklch(0.72 0.18 ${h} / 0.16)`);
  root.style.setProperty("--accent-ink",   `oklch(0.1 0.04 ${h})`);
  root.dataset.theme = "custom";
  window.localStorage.setItem(THEME_STORAGE_KEY, `custom:${h}`);
}

export function applyPreset(name: ThemeName) {
  const root = document.documentElement;
  for (const v of ["--accent", "--accent-light", "--accent-hot", "--accent-soft", "--accent-line", "--accent-glow", "--accent-ink"]) {
    root.style.removeProperty(v);
  }
  root.dataset.theme = name;
  window.localStorage.setItem(THEME_STORAGE_KEY, name);
}
