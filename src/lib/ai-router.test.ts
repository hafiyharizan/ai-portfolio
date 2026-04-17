import { describe, it, expect } from "vitest";
import { isVetoed, routeQuestion } from "./ai-router";

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

describe("routeQuestion", () => {
  it("vetoed questions always route to ai", () => {
    expect(routeQuestion("can you explain his pipeline architecture").source).toBe("ai");
    expect(routeQuestion("what do you think about his skill level").source).toBe("ai");
  });

  it("skills question routes to canned with correct category", () => {
    const result = routeQuestion("what is Hafiy's strongest technical skill");
    expect(result.source).toBe("canned");
    expect(result.category).toBe("skills");
    expect(typeof result.response).toBe("string");
  });

  it("experience question routes to canned", () => {
    const result = routeQuestion("tell me about his work experience");
    expect(result.source).toBe("canned");
    expect(result.category).toBe("experience");
  });

  it("contact question routes to canned", () => {
    const result = routeQuestion("how to contact Hafiy");
    expect(result.source).toBe("canned");
    expect(result.category).toBe("contact");
  });

  it("ambiguous multi-topic question routes to ai", () => {
    const result = routeQuestion("tell me about his projects and skills");
    expect(result.source).toBe("ai");
  });

  it("low confidence question routes to ai", () => {
    const result = routeQuestion("is he a morning person");
    expect(result.source).toBe("ai");
  });
});
