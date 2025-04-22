import type { Mock } from "vitest";

import { testClient } from "hono/testing";
import { execSync } from "node:child_process";
import fs from "node:fs";
import { afterAll, beforeAll, beforeEach, describe, expect, expectTypeOf, it, vi } from "vitest";

import env from "@/env";
import createApp from "@/lib/create-app";
import { generateArticleSummary } from "@/services/openai";

import router from "./articles.index";

if (env.NODE_ENV !== "test") {
  throw new Error("NODE_ENV must be 'test'");
}

const client = testClient(createApp().route("/api", router));

vi.mock("@/middlewares/get-conn-info", () => ({
  connInfoMiddleware: () => (_c: any, next: any) => next(),
}));

vi.mock("@/services/openai", async (importOriginal) => {
  const original = await importOriginal() as any; // Get original exports if needed
  const mockGenerateArticleSummaryFn = vi.fn();
  return {
    ...original, // Keep other potential exports from the module
    // Ensure the actual client isn't initialized if mock environment might lack keys
    client: undefined,
    // Mock the specific function called by the handler
    generateArticleSummary: mockGenerateArticleSummaryFn,
  };
});

describe("articles routes", () => {
  beforeAll(async () => {
    execSync("pnpm drizzle-kit push");
    execSync("pnpm db:seed");
  });

  afterAll(async () => {
    fs.rmSync("test.db", { force: true });
  });

  describe("get /articles", () => {
    it("lists all articles", async () => {
      const response = await client.api.articles.$get({
        query: {},
      });

      expect(response.status).toBe(200);

      if (response.status === 200) {
        const json = await response.json();
        expectTypeOf(json).toHaveProperty("data");
        expectTypeOf(json).toHaveProperty("count");
        expect(json.data.length).toBeTypeOf("number");
      }
    });

    it("list articles filtered by author id", async () => {
      const response = await client.api.articles.$get({
        query: {
          authorId: 1,
        },
      });

      expect(response.status).toBe(200);

      if (response.status === 200) {
        const json = await response.json();
        expectTypeOf(json).toHaveProperty("data");
        expectTypeOf(json).toHaveProperty("count");
        expect(json.data.length).toBe(9);
        expect(json.data[0]?.author.id).toBe(1);
      }
    });

    it("with pagination", async () => {
      const response = await client.api.articles.$get({
        query: {
          page: 1,
          limit: 10,
        },
      });

      expect(response.status).toBe(200);

      if (response.status === 200) {
        const json = await response.json();
        expectTypeOf(json).toHaveProperty("data");
        expectTypeOf(json).toHaveProperty("count");
        expectTypeOf(json).toHaveProperty("hasNextPage");
        expectTypeOf(json).toHaveProperty("total");
        expect(json.data.length).toBeTypeOf("number");
        expect(json.hasNextPage).toBeTypeOf("boolean");
      }
    });

    it("with invalid query params", async () => {
      const response = await client.api.articles.$get({
        query: {
          // @ts-expect-error - invalid query param
          page: "invalid",
        },
      });

      expect(response.status).toBe(422);

      if (response.status === 422) {
        const json = await response.json();
        expectTypeOf(json).toHaveProperty("success");
        expectTypeOf(json).toHaveProperty("error");
        expect(json.success).toBeTypeOf("boolean");
        expect(json.error).toBeTypeOf("object");
        expect(json).toEqual({
          success: false,
          error: {
            issues: expect.any(Array),
            name: expect.any(String),
          },
        });
      }
    });

    it("with pagination and filtered by author id", async () => {
      const response = await client.api.articles.$get({
        query: {
          authorId: 3,
        },
      });

      expect(response.status).toBe(200);

      if (response.status === 200) {
        const json = await response.json();
        expect(json.count).toBe(10);
        expect(json.total).toBe(11);
        expect(json.hasNextPage).toBe(true);
        expect(json.data[0]?.author.id).toBe(3);
      }
    });

    it("with sorting by shares", async () => {
      const response = await client.api.articles.$get({
        query: {
          sortBy: "shares",
        },
      });

      expect(response.status).toBe(200);

      if (response.status === 200) {
        const json = await response.json();
        expect(json.data[0]?.shares).toBeGreaterThan((json.data[1]?.shares ?? 0));
      }
    });

    it("with sorting by views ascending", async () => {
      const response = await client.api.articles.$get({
        query: {
          sortBy: "views",
          sort: "asc",
        },
      });

      expect(response.status).toBe(200);

      if (response.status === 200) {
        const json = await response.json();
        expect(json.data[0]?.views).toBeLessThan((json.data[1]?.views ?? 0));
      }
    });

    it("with good search", async () => {
      const response = await client.api.articles.$get({
        query: {
          search: "usain",
        },
      });

      expect(response.status).toBe(200);

      if (response.status === 200) {
        const json = await response.json();
        expect(json.data.length).toBe(8);
        expect(json.data[0]?.title.toLowerCase()).toContain("usain");
      }
    });

    it("with bad search", async () => {
      const response = await client.api.articles.$get({
        query: {
          search: "invalid",
        },
      });

      expect(response.status).toBe(200);

      if (response.status === 200) {
        const json = await response.json();
        expect(json.data.length).toBe(0);
      }
    });
  });

  describe("get /articles/highlights", () => {
    it("lists all highlights", async () => {
      const response = await client.api.articles.highlights.$get({
        query: {},
      });

      expect(response.status).toBe(200);

      if (response.status === 200) {
        const json = await response.json();
        expectTypeOf(json).toHaveProperty("data");
        expectTypeOf(json).toHaveProperty("success");
        expect(json.data).toHaveProperty("mostViews");
        expect(json.data).toHaveProperty("mostShares");
        expect(json.success).toBeTypeOf("boolean");
      }
    });

    it("list highlights filtered by author id", async () => {
      const response = await client.api.articles.highlights.$get({
        query: {
          authorId: 1,
        },
      });

      expect(response.status).toBe(200);

      if (response.status === 200) {
        const json = await response.json();
        expectTypeOf(json).toHaveProperty("data");
        expectTypeOf(json).toHaveProperty("success");
        expect(json.data).toHaveProperty("mostViews");
        expect(json.data).toHaveProperty("mostShares");
        expect(json.data.mostViews.author.id).toBe(1);
        expect(json.data.mostShares.author.id).toBe(1);
      }
    });

    it("list highlights filtered by author id that does not exist", async () => {
      const response = await client.api.articles.highlights.$get({
        query: {
          authorId: 999,
        },
      });

      expect(response.status).toBe(400);

      if (response.status === 400) {
        const json = await response.json();
        expectTypeOf(json).toHaveProperty("success");
        expect(json).toHaveProperty("message");
        expect(json.success).toBe(false);
        expect(json.message).toBeTypeOf("string");
      }
    });

    it("with invalid query params", async () => {
      const response = await client.api.articles.highlights.$get({
        query: {
          // @ts-expect-error - invalid query param
          authorId: "invalid",
        },
      });

      expect(response.status).toBe(422);

      if (response.status === 422) {
        const json = await response.json();
        expectTypeOf(json).toHaveProperty("success");
        expectTypeOf(json).toHaveProperty("error");
        expect(json.success).toBeTypeOf("boolean");
        expect(json.error).toBeTypeOf("object");
        expect(json).toEqual({
          success: false,
          error: {
            issues: expect.any(Array),
            name: expect.any(String),
          },
        });
      }
    });
  });

  describe("get /articles/{id}", () => {
    it("gets an article by id", async () => {
      const response = await client.api.articles[":id"].$get({
        param: { id: 1 },
      });

      expect(response.status).toBe(200);

      if (response.status === 200) {
        const json = await response.json();
        expectTypeOf(json).toHaveProperty("data");
        expectTypeOf(json).toHaveProperty("success");
        expect(json.data.id).toBe(1);
        expect(json.success).toBeTypeOf("boolean");
      }
    });

    it("with invalid id", async () => {
      const response = await client.api.articles[":id"].$get({
        // @ts-expect-error - invalid id
        param: { id: "invalid" },
      });

      expect(response.status).toBe(422);

      if (response.status === 422) {
        const json = await response.json();
        expectTypeOf(json).toHaveProperty("success");
        expectTypeOf(json).toHaveProperty("error");
        expect(json.success).toBeTypeOf("boolean");
        expect(json.success).toBe(false);
        expect(json.error).toBeTypeOf("object");
        expect(json).toEqual({
          success: false,
          error: {
            issues: expect.any(Array),
            name: expect.any(String),
          },
        });
      }
    });

    it("gets an article by id that does not exist", async () => {
      const response = await client.api.articles[":id"].$get({
        param: { id: 999 },
      });

      expect(response.status).toBe(404);

      if (response.status === 404) {
        const json = await response.json();
        expectTypeOf(json).toHaveProperty("success");
        expect(json.success).toBe(false);
        expect(json.message).toBeTypeOf("string");
      }
    });
  });

  describe("post /articles/{id}/summarize", () => {
    beforeEach(() => {
      (generateArticleSummary as Mock).mockClear();
    });

    it("should return 404 if article does not exist", async () => {
      const response = await client.api.articles[":id"].summarize.$post({
        param: { id: 999 },
      });

      expect(response.status).toBe(404);
      expect(generateArticleSummary).not.toHaveBeenCalled();

      if (response.status === 404) {
        const json = await response.json();
        expect(json.success).toBe(false);
        expect(json.message).toContain(`Article with id ${999} not found`);
      }
    });

    it("should return 422 if id is invalid", async () => {
      const response = await client.api.articles[":id"].summarize.$post({
        // @ts-expect-error - Testing invalid input
        param: { id: "invalid-id" },
      });

      expect(response.status).toBe(422);
      expect(generateArticleSummary).not.toHaveBeenCalled();

      if (response.status === 422) {
        const json = await response.json();
        expect(json.success).toBe(false);
        expect(json).toHaveProperty("error");
        expect(json.error.issues).toBeInstanceOf(Array);
      }
    });

    it("should call generateArticleSummary and return 200 with summary on success", async () => {
      const mockSummary = "This is the mocked summary from the test.";
      (generateArticleSummary as Mock).mockResolvedValue(mockSummary);

      const response = await client.api.articles[":id"].summarize.$post({
        param: { id: 1 },
      });

      expect(response.status).toBe(200);
      expect(generateArticleSummary).toHaveBeenCalledTimes(1);

      if (response.status === 200) {
        const json = await response.json();
        expect(json.success).toBe(true);
        expect(json.data).toBeDefined();
        expect(json.data.summary).toBe(mockSummary);
        expect(json).toEqual({
          success: true,
          data: {
            summary: mockSummary,
          },
        });
      }
    });

    it("should return 200 with fallback summary if generateArticleSummary provides one (e.g., on internal error)", async () => {
      const fallbackSummary = "Could not generate summary, using fallback.";
      (generateArticleSummary as Mock).mockResolvedValue(fallbackSummary);

      const response = await client.api.articles[":id"].summarize.$post({
        param: { id: 2 },
      });

      expect(response.status).toBe(200);
      expect(generateArticleSummary).toHaveBeenCalledTimes(1);

      if (response.status === 200) {
        const json = await response.json();
        expect(json.success).toBe(true);
        expect(json.data.summary).toBe(fallbackSummary);
      }
    });
  });
});
