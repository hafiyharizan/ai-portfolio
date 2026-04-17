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
