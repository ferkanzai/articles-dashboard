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

  it("get /articles lists all articles", async () => {
    const response = await client.api.articles.$get();
    expect(response.status).toBe(200);

    if (response.status === 200) {
      const json = await response.json();
      expectTypeOf(json).toHaveProperty("data");
      expectTypeOf(json).toHaveProperty("count");
      expect(json.data.length).toBeTypeOf("number");
    }
  });
});
