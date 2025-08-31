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
    this.cliInterface.setDebugModeHandler(this.enterDebugMode.bind(this));
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
      console.log(
        "请使用 --interactive 启动交互式模式，或使用 --command 执行特定命令"
      );
      console.log("💡 在交互式模式中输入 'debug' 可进入调试模式");
      process.exit(1);
    }
  }

  /**
   * 进入调试模式
   */
  private async enterDebugMode(): Promise<void> {
    console.log("🔧 进入调试模式 - 模块: browser");
    console.log("👀 启动观察环境...");

    try {
      await this.startBrowserDebugEnvironment();
    } catch (error) {
      console.error(`❌ 调试模式失败: ${error}`);
    }
  }

  /**
   * 启动Browser调试观察环境
   */
  private async startBrowserDebugEnvironment(): Promise<void> {
    console.log("🔍 正在初始化 browser 调试环境...");

    try {
      const browserModule = await import("../browser/index.js");

      console.log("✅ browser 模块加载成功");
      console.log("📦 可用函数:", Object.keys(browserModule));

      // 设置调试环境的输入处理器
      this.cliInterface.setInputHandler(async (input: string) => {
        await this.handleDebugCommand(input, browserModule);
      });

      console.log("👀 调试环境已启动！");
      console.log("📝 可用调试命令:");
      console.log("  test     - 运行 puppeteerTest 函数");
      console.log("  list     - 显示所有可用函数");
      console.log("  help     - 显示调试帮助");
      console.log("  normal   - 返回正常模式");
      console.log("  exit     - 退出程序");
      console.log("💡 提示: 直接输入函数名也可以执行对应函数\n");
    } catch (error) {
      throw new Error(`初始化 browser 调试环境失败: ${error}`);
    }
  }

  /**
   * 处理调试命令
   */
  private async handleDebugCommand(
    input: string,
    browserModule: any
  ): Promise<void> {
    const command = input.trim().toLowerCase();
    console.log(`🔍 [DEBUG] handleDebugCommand 被调用，输入命令: ${command}`);
    console.log(`debug-mode: ${command}`);

    try {
      switch (command) {
        case "test":
        case "puppeteertest":
          if (browserModule.puppeteerTest) {
            console.log("🔧 正在执行 puppeteerTest...");
            await browserModule.puppeteerTest();
            console.log("✅ puppeteerTest 执行完成");
          } else {
            console.log("⚠️  puppeteerTest 函数不存在");
          }
          break;

        case "list":
          console.log("📦 所有可用函数:");
          Object.keys(browserModule).forEach((key) => {
            const type = typeof browserModule[key];
            console.log(`  ${key} (${type})`);
          });
          break;

        case "help":
          console.log("📝 调试命令帮助:");
          console.log("  test     - 运行 puppeteerTest 函数");
          console.log("  list     - 显示所有可用函数");
          console.log("  help     - 显示这个帮助信息");
          console.log("  normal   - 返回正常模式");
          console.log("  exit     - 退出程序");
          console.log("💡 也可以直接输入函数名来执行");
          break;

        case "normal":
        case "back":
          // 返回正常模式
          console.log("🔙 返回正常模式");
          this.cliInterface.setInputHandler(this.handleUserInput.bind(this));
          break;

        default:
          // 尝试直接执行函数
          if (browserModule[input.trim()]) {
            const func = browserModule[input.trim()];
            if (typeof func === "function") {
              console.log(`🔧 正在执行 ${input.trim()}...`);
              await func();
              console.log(`✅ ${input.trim()} 执行完成`);
            } else {
              console.log(`⚠️  ${input.trim()} 不是一个函数`);
            }
          } else {
            console.log(`⚠️  未知命令: ${input}`);
            console.log("💡 输入 'help' 查看可用命令");
          }
          break;
      }
    } catch (error) {
      console.error(`❌ 执行命令失败: ${error}`);
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
