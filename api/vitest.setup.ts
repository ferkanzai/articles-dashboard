import { execSync } from "node:child_process";
import fs from "node:fs";
import { afterAll, beforeAll, vi } from "vitest";

vi.mock("@/middlewares/get-conn-info", () => ({
  connInfoMiddleware: () => (_c: any, next: any) => next(),
}));

beforeAll(async () => {
  execSync("pnpm drizzle-kit push");
  execSync("pnpm db:seed");
});

afterAll(async () => {
  fs.rmSync("test.db", { force: true });
});
