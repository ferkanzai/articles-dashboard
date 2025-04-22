import type { Context } from "hono";

import OpenAI from "openai";

import type { ArticleWithAuthor } from "@/db/schema";
import type { AppBindings } from "@/lib/types";

import env from "@/env";

export const client = env.OPENAI_API_KEY
  ? new OpenAI({
    apiKey: env.OPENAI_API_KEY,
  })
  : undefined;

async function returnMockSummary(article: ArticleWithAuthor) {
  await new Promise(resolve => setTimeout(resolve, 1000));

  return article.summary ?? article.content;
}

async function generateArticleSummary(c: Context<AppBindings>, article: ArticleWithAuthor) {
  const { logger } = c.var;
  try {
    if (!client) {
      logger.error({
        msg: "OpenAI client not found",
      });

      return returnMockSummary(article);
    }

    logger.info({
      msg: "Generating article summary",
      articleId: article.id,
    });

    const response = await client.responses.create({
      model: "gpt-4.1",
      instructions: "You are a helpful assistant that summarizes articles.",
      input: [
        {
          role: "system",
          content: "You are a helpful assistant that summarizes articles.",
        },
        {
          role: "user",
          content: `Title: ${article.title}. Author: ${article.author.name}. Content: ${article.content}`,
        },
        {
          role: "user",
          content: "Summarize the article in 2-3 sentences. Do not include any other text.",
        },
      ],
      text: {
        format: {
          type: "text",
        },
      },
    });

    return response.output_text;
  } catch (error) {
    logger.error({
      msg: "Error generating article summary",
      error,
    });

    return returnMockSummary(article);
  }
}

export { generateArticleSummary };
