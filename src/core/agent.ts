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
        if (this.config.cli.test !== undefined) {
            await this.runTestMode(this.config.cli.test);
        } else if (this.config.cli.interactive) {
            this.cliInterface.startInteractive();
        } else if (this.config.cli.command) {
            await this.executeCommand(this.config.cli.command);
        } else {
            console.log("请使用 --interactive 启动交互式模式，或使用 --command 执行特定命令，或使用 --test 进入调试模式");
            process.exit(1);
        }
    }

    /**
     * 运行测试模式
     */
    private async runTestMode(module?: string): Promise<void> {
        const targetModule = module || 'browser';
        console.log(`🔧 进入调试模式 - 模块: ${targetModule}`);
        
        try {
            if (targetModule === 'browser') {
                await this.testBrowserModule();
            } else {
                console.log(`⚠️  暂不支持模块: ${targetModule}，默认调试 browser 模块`);
                await this.testBrowserModule();
            }
        } catch (error) {
            console.error(`❌ 调试模式失败: ${error}`);
            process.exit(1);
        }
        
        console.log("✅ 调试模式完成");
        process.exit(0);
    }

    /**
     * 测试browser模块
     */
    private async testBrowserModule(): Promise<void> {
        console.log("🔍 正在加载 browser 模块...");
        
        try {
            const browserModule = await import("../browser/index.js");
            
            console.log("✅ browser 模块加载成功");
            console.log("📦 可用函数:", Object.keys(browserModule));
            
            // 测试puppeteer函数
            if (browserModule.puppeteer) {
                console.log("🔧 正在测试 puppeteer 函数...");
                browserModule.puppeteer();
            } else {
                console.log("⚠️  puppeteer 函数不存在");
            }
            
        } catch (error) {
            throw new Error(`加载 browser 模块失败: ${error}`);
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
