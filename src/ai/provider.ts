/**
 * AI 提供商模块
 */

import { streamText, tool } from "ai";
import { createDeepSeek } from "@ai-sdk/deepseek";
import type { AIMessage, AIConfig } from "../../types/index.js";
import { ACTION_PARSER_PROMPT } from "../prompts/action-parser.js";
import z from "zod";

// 动作类型 Schema
const ActionTypeSchema = z.enum([
  // 页面导航
  "navigate",
  "back",
  "forward",
  "refresh",

  // 元素交互
  "click",
  "type",
  "select",
  "check",
  "uncheck",
  "hover",
  "scroll",

  // 等待和验证
  "wait",
  "waitForElement",
  "waitForText",
  "assertText",
  "assertElement",

  // 数据操作
  "extractText",
  "extractAttribute",
  "screenshot",
  "download",
]);

// 浏览器动作 Schema
const BrowserActionSchema = z.object({
  action: ActionTypeSchema,
  target: z.string().describe("目标元素的选择器或URL"),
  value: z.string().describe("动作的值，如输入文本、选择选项等"),
  description: z.string().describe("动作的描述信息"),
  wait: z.number().optional().describe("等待时间（毫秒）"),
});

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
        tools: {
          puppeteer: tool({
            description: "使用 Puppeteer 工具执行浏览器自动化操作",
            inputSchema: BrowserActionSchema,
            execute: async (params: any) => {
              console.log("puppeteer params:", params);
              return params;
            },
          }),
        },
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
