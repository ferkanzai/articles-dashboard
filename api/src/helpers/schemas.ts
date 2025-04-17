import { z } from "@hono/zod-openapi";

export type ZodSchema = z.ZodUnion<any> | z.AnyZodObject | z.ZodArray<z.AnyZodObject>;

const createMessageObjectSchema = (exampleMessage: string = "Hello World") => {
  return z.object({
    message: z.string(),
  }).openapi({
    example: {
      message: exampleMessage,
    },
  });
};

const jsonContent = <
  T extends ZodSchema,
>(schema: T,
  description: string,
) => {
  return {
    content: {
      "application/json": {
        schema,
      },
    },
    description,
  };
};

export { createMessageObjectSchema, jsonContent };
