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

    it("with query params", async () => {
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
  });
});
