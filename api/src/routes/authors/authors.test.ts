import { testClient } from "hono/testing";
import { describe, expect, expectTypeOf, it } from "vitest";

import env from "@/env";
import createApp from "@/lib/create-app";

import router from "./authors.index";

if (env.NODE_ENV !== "test") {
  throw new Error("NODE_ENV must be 'test'");
}

const client = testClient(createApp().route("/api", router));

describe("authors routes", () => {
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
