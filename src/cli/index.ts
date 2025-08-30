/**
 * CLI 界面模块
 */

import { createInterface } from "readline";
import { Command } from "commander";
import type { CLIConfig } from "../../types/index.js";
import { CommandHandler } from "./commands.js";

/**
 * CLI 界面类
 */
export class CLIInterface {
    private rl: any;
    private commandHandler: CommandHandler;
    private onInput?: (input: string) => Promise<void>;
    private onExit?: () => void;

    constructor(version: string = "1.0.0") {
        this.commandHandler = new CommandHandler(version);
    }

    /**
     * 设置输入处理器
     */
    setInputHandler(handler: (input: string) => Promise<void>): void {
        this.onInput = handler;
    }

    /**
     * 设置退出处理器
     */
    setExitHandler(handler: () => void): void {
        this.onExit = handler;
    }

    /**
     * 启动交互式模式
     */
    startInteractive(): void {
        this.rl = createInterface({
            input: process.stdin,
            output: process.stdout,
        });

        console.log("🚀 欢迎使用 Browser Agent!");
        console.log('输入 "help" 查看可用命令，输入 "exit" 退出程序');
        console.log("💬 直接输入内容将发送给AI模型获取响应\n");

        this.askQuestion();
    }

    /**
     * 停止交互式模式
     */
    stop(): void {
        if (this.rl) {
            this.rl.close();
        }
    }

    /**
     * 询问用户输入
     */
    private askQuestion(): void {
        this.rl.question("browser-agent> ", async (input: string) => {
            const trimmedInput = input.trim();

            if (this.commandHandler.isExitCommand(trimmedInput)) {
                console.log("👋 再见!");
                this.stop();
                if (this.onExit) {
                    this.onExit();
                }
                return;
            }

            if (trimmedInput === "") {
                // 空输入，继续询问
                this.askQuestion();
                return;
            }

            // 处理命令
            const commandResult = await this.commandHandler.handleCommand(trimmedInput);
            if (commandResult.handled) {
                if (commandResult.output) {
                    if (commandResult.output === 'exit') {
                        console.log("👋 再见!");
                        this.stop();
                        if (this.onExit) {
                            this.onExit();
                        }
                        return;
                    }
                    console.log(commandResult.output);
                }
            } else {
                // 非命令输入，交给AI处理器
                if (this.onInput) {
                    try {
                        await this.onInput(trimmedInput);
                    } catch (error) {
                        console.error("❌ 处理输入失败:", error);
                    }
                }
            }

            console.log(""); // 空行分隔
            this.askQuestion();
        });
    }
}

/**
 * 创建命令行程序
 */
export function createCLIProgram(_config?: CLIConfig): Command {
    const program = new Command();

    program
        .name("browser-agent")
        .description("浏览器自动化代理工具")
        .version("1.0.0");

    program
        .option("-i, --interactive", "启动交互式模式")
        .option("-c, --command <command>", "执行指定命令")
        .option("-v, --verbose", "详细输出模式");

    return program;
}

/**
 * 解析命令行参数
 */
export function parseCLIArgs(program: Command): CLIConfig {
    program.parse();
    const options = program.opts();

    return {
        interactive: options.interactive || false,
        command: options.command,
        verbose: options.verbose || false,
    };
}
