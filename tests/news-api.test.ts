import { describe, it, expect } from "vitest";

describe("NewsAPI Key Validation", () => {
  it("should validate NewsAPI Key", async () => {
    const apiKey = process.env.NEWS_API_KEY;
    
    expect(apiKey).toBeDefined();
    expect(apiKey).toHaveLength(32); // NewsAPI keys are typically 32 characters
    
    // Test basic API call
    const response = await fetch(
      `https://newsapi.org/v2/everything?q=Corinthians&sortBy=publishedAt&language=pt&apiKey=${apiKey}`
    );
    
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty("articles");
  });
});
