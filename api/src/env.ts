/* eslint-disable node/no-process-env */
import { config } from "dotenv";
import { expand } from "dotenv-expand";
import path from "node:path";
import { z } from "zod";

expand(config({
  path: path.resolve(
    process.cwd(),
    process.env.NODE_ENV === "test" ? ".env.test" : ".env",
  ),
}));

const stringBoolean = z.coerce
  .string()
  .transform((val) => { return val === "true"; })
  .default("false");

const EnvSchema = z.object({
  DATABASE_URL: z.string().url(),
  DB_MIGRATING: stringBoolean,
  DB_SEED: stringBoolean,
  LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace", "silent"]).default("info"),
  NODE_ENV: z.union([z.literal("development"), z.literal("test"), z.literal("production")]).default("development"),
  PORT: z.coerce.number().default(3000),
}).superRefine((input, ctx) => {
  if (input.NODE_ENV === "production" && input.LOG_LEVEL === "debug") {
    ctx.addIssue({
      code: z.ZodIssueCode.invalid_literal,
      expected: "info",
      fatal: true,
      message: "LOG_LEVEL must be 'info' when NODE_ENV is 'production'",
      path: ["LOG_LEVEL"],
      received: input.LOG_LEVEL,
    });
  }
});

export type env = z.infer<typeof EnvSchema>;

// eslint-disable-next-line ts/no-redeclare
const { data: env, error } = EnvSchema.safeParse(process.env);

if (error) {
  console.error("❌ Invalid env:");
  console.error(JSON.stringify(error.flatten().fieldErrors, null, 2));
  process.exit(2);
}

export default env!;
