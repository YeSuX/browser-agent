/**
 * 核心 Agent 模块
 */

import type { BrowserAgentConfig, AIMessage } from "../../types/index.js";
import { AIProvider } from "../ai/provider.js";
import { CLIInterface } from "../cli/index.js";

/**
 * Browser Agent 核心类
 */
export class BrowserAgent {
    private aiProvider: AIProvider;
    private cliInterface: CLIInterface;
    private config: BrowserAgentConfig;

    constructor(config: BrowserAgentConfig) {
        this.config = config;
        this.aiProvider = new AIProvider(config.ai);
        this.cliInterface = new CLIInterface("1.0.0");

        // 设置CLI输入处理器
        this.cliInterface.setInputHandler(this.handleUserInput.bind(this));
        this.cliInterface.setExitHandler(this.handleExit.bind(this));
    }

    /**
     * 启动Agent
     */
    async start(): Promise<void> {
        if (this.config.cli.interactive) {
            this.cliInterface.startInteractive();
        } else if (this.config.cli.command) {
            await this.executeCommand(this.config.cli.command);
        } else {
            console.log("请使用 --interactive 启动交互式模式，或使用 --command 执行特定命令");
            process.exit(1);
        }
    }



    /**
     * 执行命令
     */
    private async executeCommand(command: string): Promise<void> {
        console.log(`🚀 执行命令: ${command}`);
        await this.handleUserInput(command);
    }

    /**
     * 处理用户输入
     */
    private async handleUserInput(input: string): Promise<void> {
        console.log(`📝 收到输入: ${input}`);

        try {
            console.log("🤖 正在发送给AI模型...");
            await this.processWithAI(input);
        } catch (error) {
            console.error("❌ AI处理失败:", error);
        }
    }

    /**
     * 使用AI处理输入
     */
    private async processWithAI(input: string): Promise<void> {
        console.log("📤 AI流式响应:");

        try {
            const messages: AIMessage[] = [{ role: "user", content: input }];
            const stream = this.aiProvider.generateStreamText(messages);

            for await (const chunk of stream) {
                process.stdout.write(chunk);
            }

            console.log(""); // 输出结束后换行
        } catch (error) {
            throw new Error(`AI模型调用失败: ${error}`);
        }
    }

    /**
     * 处理退出
     */
    private handleExit(): void {
        console.log("Browser Agent 已停止");
        process.exit(0);
    }


}

/**
 * 创建Browser Agent实例
 */
export function createBrowserAgent(config: BrowserAgentConfig): BrowserAgent {
    return new BrowserAgent(config);
}
