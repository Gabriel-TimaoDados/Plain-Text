import { describe, it, expect } from "vitest";

describe("YouTube API Key Validation", () => {
  it("should validate YouTube API Key", async () => {
    const apiKey = process.env.YOUTUBE_API_KEY;
    
    expect(apiKey).toBeDefined();
    expect(apiKey).toHaveLength(39); // YouTube API keys are typically 39 characters
    
    // Test basic API call
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=Corinthians+gol&maxResults=1&key=${apiKey}`
    );
    
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty("items");
  });
});
