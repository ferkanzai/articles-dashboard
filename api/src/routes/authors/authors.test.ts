import { testClient } from "hono/testing";
import { execSync } from "node:child_process";
import fs from "node:fs";
import { afterAll, beforeAll, describe, expect, expectTypeOf, it, vi } from "vitest";

import env from "@/env";
import createApp from "@/lib/create-app";

import router from "./authors.index";

if (env.NODE_ENV !== "test") {
  throw new Error("NODE_ENV must be 'test'");
}

vi.mock("@/middlewares/get-conn-info", () => ({
  connInfoMiddleware: () => (_c: any, next: any) => next(),
}));

const client = testClient(createApp().route("/api", router));

describe("authors routes", () => {
  beforeAll(async () => {
    execSync("pnpm drizzle-kit push");
    execSync("pnpm db:seed");
  });

  afterAll(async () => {
    fs.rmSync("test.db", { force: true });
  });

  describe("get /authors", () => {
    it("should return a list of authors", async () => {
      const response = await client.api.authors.$get();

      expect(response.status).toBe(200);

      if (response.status === 200) {
        const json = await response.json();
        expectTypeOf(json).toHaveProperty("data");
        expectTypeOf(json).toHaveProperty("count");
        expect(json.data.length).toBeTypeOf("number");
        expect(json.success).toBe(true);
      }
    });
  });
});
