import { describe, it, expect } from "vitest";

describe("API-Football Integration", () => {
  it("should validate API key by fetching Corinthians team", async () => {
    const apiKey = process.env.EXPO_PUBLIC_API_FOOTBALL_KEY;
    
    if (!apiKey) {
      throw new Error("EXPO_PUBLIC_API_FOOTBALL_KEY is not set");
    }

    // Corinthians team ID in API-Football is 45
    const response = await fetch("https://v3.football.api-sports.io/teams?id=45", {
      method: "GET",
      headers: {
        "x-apisports-key": apiKey,
      },
    });

    expect(response.status).toBe(200);
    
    const data = await response.json();
    expect(data).toHaveProperty("response");
    expect(data.response.length).toBeGreaterThan(0);
    
    // Verify we got a valid team object with required fields
    const team = data.response[0];
    expect(team).toHaveProperty("team");
    expect(team.team).toHaveProperty("id");
    expect(team.team).toHaveProperty("name");
    // Team ID 45 should be in the response
    expect(team.team.id).toBe(45);
  });

  it("should fetch Corinthians fixtures/matches", async () => {
    const apiKey = process.env.EXPO_PUBLIC_API_FOOTBALL_KEY;
    
    if (!apiKey) {
      throw new Error("EXPO_PUBLIC_API_FOOTBALL_KEY is not set");
    }

    // Get Corinthians fixtures for the current season
    const response = await fetch(
      "https://v3.football.api-sports.io/fixtures?team=45&season=2026&limit=10",
      {
        method: "GET",
        headers: {
          "x-apisports-key": apiKey,
        },
      }
    );

    expect(response.status).toBe(200);
    
    const data = await response.json();
    expect(data).toHaveProperty("response");
    expect(Array.isArray(data.response)).toBe(true);
  });

  it("should fetch player statistics", async () => {
    const apiKey = process.env.EXPO_PUBLIC_API_FOOTBALL_KEY;
    
    if (!apiKey) {
      throw new Error("EXPO_PUBLIC_API_FOOTBALL_KEY is not set");
    }

    // Get Corinthians squad/players
    const response = await fetch(
      "https://v3.football.api-sports.io/players/squads?team=45",
      {
        method: "GET",
        headers: {
          "x-apisports-key": apiKey,
        },
      }
    );

    expect(response.status).toBe(200);
    
    const data = await response.json();
    expect(data).toHaveProperty("response");
  });
});
