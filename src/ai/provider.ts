/**
 * AI 提供商模块
 */

import { streamText } from "ai";
import { createDeepSeek } from "@ai-sdk/deepseek";
import type { AIMessage, AIConfig } from "../../types/index.js";
import { ACTION_PARSER_PROMPT } from "../prompts/action-parser.js";

/**
 * AI 提供商类
 */
export class AIProvider {
  private provider: any;

  constructor(config: AIConfig) {
    this.provider = createDeepSeek({
      apiKey: config.apiKey,
      fetch: globalThis.fetch,
    });
  }

  /**
   * 生成流式文本响应
   */
  async *generateStreamText(
    messages: AIMessage[],
    config?: Partial<AIConfig>
  ): AsyncGenerator<string, void, unknown> {
    try {
      const result = await streamText({
        model: this.provider(config?.model || "deepseek-chat"),
        system: ACTION_PARSER_PROMPT,
        messages,
      });

      for await (const delta of result.textStream) {
        yield delta;
      }
    } catch (error) {
      throw new Error(`AI流式生成失败: ${error}`);
    }
  }
}
