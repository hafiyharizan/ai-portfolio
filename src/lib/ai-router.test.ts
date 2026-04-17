import { describe, it, expect } from "vitest";
import { isVetoed } from "./ai-router";

describe("isVetoed", () => {
  it("vetoes opinion and deep-dive phrases", () => {
    expect(isVetoed("what do you think about his skills")).toBe(true);
    expect(isVetoed("how would you describe his approach")).toBe(true);
    expect(isVetoed("can you explain his data pipeline work")).toBe(true);
    expect(isVetoed("compare his background with a senior engineer")).toBe(true);
    expect(isVetoed("what tradeoff did he make on the DREAM project")).toBe(true);
  });

  it("does not veto clean recruiter questions", () => {
    expect(isVetoed("what is Hafiy's strongest skill")).toBe(false);
    expect(isVetoed("tell me about his projects")).toBe(false);
    expect(isVetoed("what tech stack does he use")).toBe(false);
    expect(isVetoed("how can I contact Hafiy")).toBe(false);
  });
});
