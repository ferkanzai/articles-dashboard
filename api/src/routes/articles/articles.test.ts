import { testClient } from "hono/testing";
import { execSync } from "node:child_process";
import fs from "node:fs";
import { afterAll, beforeAll, describe, expect, expectTypeOf, it, vi } from "vitest";

import env from "@/env";
import createApp from "@/lib/create-app";

import router from "./articles.index";

vi.mock("@/middlewares/get-conn-info", () => ({
  connInfoMiddleware: () => (_c: any, next: any) => next(),
}));

if (env.NODE_ENV !== "test") {
  throw new Error("NODE_ENV must be 'test'");
}

const client = testClient(createApp().route("/api", router));

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
        expect(json.data.length).toBeTypeOf("number");
        expect(json.data.length).toBe(2);
        expect(json.success).toBeTypeOf("boolean");
        expect(json.data[0]?.highlight).toBe("shares");
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
        expect(json.data.length).toBeTypeOf("number");
        expect(json.data.length).toBe(2);
        expect(json.data[0]?.highlight).toBe("shares");
        expect(json.data[1]?.highlight).toBe("views");
        expect(json.data[0]?.author.id).toBe(1);
        expect(json.data[1]?.author.id).toBe(1);
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
});
