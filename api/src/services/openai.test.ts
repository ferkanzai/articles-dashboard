import { beforeEach, describe, expect, it, vi } from "vitest";

import type { ArticleWithAuthor } from "@/db/schema";

const mockOpenAICreate = vi.fn();
vi.mock("openai", () => {
  const MockOpenAI = vi.fn().mockImplementation(() => ({
    responses: {
      create: mockOpenAICreate,
    },
  }));

  return {
    default: MockOpenAI,
  };
});

const mockEnv = {
  OPENAI_API_KEY: undefined as string | undefined,
};

vi.mock("@/env", () => ({
  default: mockEnv,
}));

const mockLogger = {
  info: vi.fn(),
  error: vi.fn(),
};

const mockContext: any = {
  var: {
    logger: mockLogger,
  },
};

const mockArticleWithSummary: ArticleWithAuthor = {
  id: 1,
  title: "Test Article With Summary",
  content: "This is the full article content.",
  summary: "This is the existing summary.",
  author: { id: 1, name: "Test Author" },
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  shares: 0,
  views: 0,
};

const mockArticleWithoutSummary: ArticleWithAuthor = {
  ...mockArticleWithSummary,
  id: 2,
  title: "Test Article Without Summary",
  summary: null,
};

describe("generateArticleSummary", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockOpenAICreate.mockReset();
  });

  describe("when OPENAI_API_KEY is not set", () => {
    let generateArticleSummary: typeof import("./openai").generateArticleSummary;

    beforeEach(async () => {
      mockEnv.OPENAI_API_KEY = undefined;
      // Use vi.resetModules to force re-evaluation of the module under test
      // This ensures the 'client' variable inside openai.ts is created based on the *current* mockEnv state
      vi.resetModules();
      // Re-import the module under test AFTER resetting modules and setting mock env
      const module = await import("./openai");
      generateArticleSummary = module.generateArticleSummary;
    });

    it("should return existing article summary if available and log an error", async () => {
      const result = await generateArticleSummary(mockContext, mockArticleWithSummary);

      expect(result).toBe(mockArticleWithSummary.summary);
      expect(mockLogger.error).toHaveBeenCalledTimes(1);
      expect(mockLogger.error).toHaveBeenCalledWith({ msg: "OpenAI client not found" });
      expect(mockLogger.info).not.toHaveBeenCalled();
      expect(mockOpenAICreate).not.toHaveBeenCalled(); // Ensure OpenAI API was not called
    });

    it("should return article content if summary is null and log an error", async () => {
      const result = await generateArticleSummary(mockContext, mockArticleWithoutSummary);

      expect(result).toBe(mockArticleWithoutSummary.content); // Fallback to content
      expect(mockLogger.error).toHaveBeenCalledTimes(1);
      expect(mockLogger.error).toHaveBeenCalledWith({ msg: "OpenAI client not found" });
      expect(mockLogger.info).not.toHaveBeenCalled();
      expect(mockOpenAICreate).not.toHaveBeenCalled();
    });
  });

  describe("when OPENAI_API_KEY is set", () => {
    const apiKey = "test-openai-key";
    const mockApiResponse = { output_text: "Mocked AI summary text" };
    let generateArticleSummary: typeof import("./openai").generateArticleSummary;

    beforeEach(async () => {
      mockEnv.OPENAI_API_KEY = apiKey;
      vi.resetModules();
      // Force re-evaluation to create the OpenAI client instance
      // Re-import the module under test AFTER resetting modules and setting mock env
      const module = await import("./openai");
      generateArticleSummary = module.generateArticleSummary;

      // Set default mock behavior for successful API call in this block
      mockOpenAICreate.mockResolvedValue(mockApiResponse);
    });

    it("should call OpenAI API and return the generated summary", async () => {
      const result = await generateArticleSummary(mockContext, mockArticleWithSummary);

      expect(result).toBe(mockApiResponse.output_text);

      expect(mockLogger.info).toHaveBeenCalledTimes(1);
      expect(mockLogger.info).toHaveBeenCalledWith({
        msg: "Generating article summary",
        articleId: mockArticleWithSummary.id,
      });
      expect(mockLogger.error).not.toHaveBeenCalled();

      expect(mockOpenAICreate).toHaveBeenCalledTimes(1);
      expect(mockOpenAICreate).toHaveBeenCalledWith({
        model: "gpt-4.1",
        instructions: "You are a helpful assistant that summarizes articles.",
        input: [
          { role: "system", content: "You are a helpful assistant that summarizes articles." },
          {
            role: "user",
            content: `Title: ${mockArticleWithSummary.title}. Author: ${mockArticleWithSummary.author.name}. Content: ${mockArticleWithSummary.content}`,
          },
          { role: "user", content: "Summarize the article in 2-3 sentences. Do not include any other text." },
        ],
        text: { format: { type: "text" } },
      });
    });

    it("should fallback to existing summary and log error if OpenAI API call fails", async () => {
      const apiError = new Error("OpenAI API failed");
      mockOpenAICreate.mockRejectedValue(apiError);

      const result = await generateArticleSummary(mockContext, mockArticleWithSummary);

      expect(result).toBe(mockArticleWithSummary.summary);

      expect(mockLogger.info).toHaveBeenCalledTimes(1);
      expect(mockLogger.info).toHaveBeenCalledWith({
        msg: "Generating article summary",
        articleId: mockArticleWithSummary.id,
      });
      expect(mockLogger.error).toHaveBeenCalledTimes(1);
      expect(mockLogger.error).toHaveBeenCalledWith({
        msg: "Error generating article summary",
        error: apiError,
      });

      expect(mockOpenAICreate).toHaveBeenCalledTimes(1);
    });

    it("should fallback to content if summary is null and OpenAI API call fails", async () => {
      const apiError = new Error("OpenAI API failed");
      mockOpenAICreate.mockRejectedValue(apiError);

      const result = await generateArticleSummary(mockContext, mockArticleWithoutSummary);

      expect(result).toBe(mockArticleWithoutSummary.content);

      expect(mockLogger.info).toHaveBeenCalledTimes(1);
      expect(mockLogger.info).toHaveBeenCalledWith({
        msg: "Generating article summary",
        articleId: mockArticleWithoutSummary.id,
      });
      expect(mockLogger.error).toHaveBeenCalledTimes(1);
      expect(mockLogger.error).toHaveBeenCalledWith({
        msg: "Error generating article summary",
        error: apiError,
      });

      expect(mockOpenAICreate).toHaveBeenCalledTimes(1);
    });
  });
});
