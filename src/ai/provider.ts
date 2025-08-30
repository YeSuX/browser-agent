/**
 * AI 提供商模块
 */

import { generateText, streamText } from "ai";
import { createDeepSeek } from "@ai-sdk/deepseek";
import type { AIMessage, AIConfig } from "../../types/index.js";

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
     * 生成文本响应（非流式）
     */
    async generateText(messages: AIMessage[], config?: Partial<AIConfig>): Promise<string> {
        try {
            const result = await generateText({
                model: this.provider(config?.model || "deepseek-chat"),
                messages,
                temperature: config?.temperature || 0.7,
            });

            return result.text;
        } catch (error) {
            throw new Error(`AI生成失败: ${error}`);
        }
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
                messages,
                temperature: config?.temperature || 0.7,
            });

            for await (const delta of result.textStream) {
                yield delta;
            }
        } catch (error) {
            throw new Error(`AI流式生成失败: ${error}`);
        }
    }

    /**
     * 简单的问答接口
     */
    async ask(question: string, config?: Partial<AIConfig>): Promise<string> {
        const messages: AIMessage[] = [{ role: "user", content: question }];
        return this.generateText(messages, config);
    }

    /**
     * 流式问答接口
     */
    async *askStream(
        question: string,
        config?: Partial<AIConfig>
    ): AsyncGenerator<string, void, unknown> {
        const messages: AIMessage[] = [{ role: "user", content: question }];
        yield* this.generateStreamText(messages, config);
    }
}

/**
 * 创建 AI 提供商实例
 */
export function createAIProvider(config: AIConfig): AIProvider {
    return new AIProvider(config);
}
