import type { AnyZodObject } from "zod";

import { z } from "@hono/zod-openapi";

export type ZodSchema = z.ZodUnion<any> | z.AnyZodObject | z.ZodArray<z.AnyZodObject>;

function createMessageObjectSchema(exampleMessage: string = "Hello World") {
  return z.object({
    message: z.string(),
    success: z.boolean(),
  }).openapi({
    example: {
      message: exampleMessage,
      success: true,
    },
  });
}

function createObjectSchemaWithSuccess<T extends AnyZodObject>(extendSchema: T, example: any) {
  return z.object({
    success: z.boolean(),
  }).merge(extendSchema).openapi({
    example: {
      ...example,
      success: example.success ?? true,
    },
  });
}

function jsonContent<
  T extends ZodSchema,
>(schema: T, description: string) {
  return {
    content: {
      "application/json": {
        schema,
      },
    },
    description,
  };
}

function createErrorSchema<
  T extends ZodSchema,
>(schema: T) {
  const { error } = schema.safeParse(
    schema._def.typeName
    === z.ZodFirstPartyTypeKind.ZodArray
      ? []
      : {},
  );

  return z.object({
    success: z.boolean().openapi({
      example: false,
    }),
    error: z
      .object({
        issues: z.array(
          z.object({
            code: z.string(),
            path: z.array(
              z.union([z.string(), z.number()]),
            ),
            message: z.string().optional(),
          }),
        ),
        name: z.string(),
      })
      .openapi({
        example: error,
      }),
  });
}

const idParamsSchema = z.object({
  id: z.coerce.number().openapi({
    param: {
      name: "id",
      in: "path",
      required: true,
    },
    required: ["id"],
    example: 42,
  }),
});

export { createErrorSchema, createMessageObjectSchema, createObjectSchemaWithSuccess, idParamsSchema, jsonContent };
