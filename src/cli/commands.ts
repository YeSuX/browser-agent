/**
 * CLI 命令处理模块
 */

import type { CommandType } from "../../types/index.js";

/**
 * 命令处理器类
 */
export class CommandHandler {
    private version: string;

    constructor(version: string = "1.0.0") {
        this.version = version;
    }

    /**
     * 处理命令
     */
    async handleCommand(command: string): Promise<{ handled: boolean; output?: string }> {
        const trimmedCommand = command.trim().toLowerCase() as CommandType;

        switch (trimmedCommand) {
            case 'help':
                return { handled: true, output: this.getHelpText() };
            case 'version':
                return { handled: true, output: this.getVersionText() };
            case 'status':
                return { handled: true, output: this.getStatusText() };
            case 'test':
                return { handled: true, output: this.getTestText() };
            case 'exit':
            case 'quit':
                return { handled: true, output: 'exit' };
            default:
                return { handled: false };
        }
    }

    /**
     * 获取帮助文本
     */
    private getHelpText(): string {
        return `
📖 可用命令:
  help     - 显示此帮助信息
  exit     - 退出程序
  quit     - 退出程序
  version  - 显示版本信息
  status   - 显示当前状态
  test     - 进入调试模式

💡 提示: 直接输入其他内容将发送给AI模型获取响应
    `.trim();
    }

    /**
     * 获取版本文本
     */
    private getVersionText(): string {
        return `📦 版本: ${this.version}`;
    }

    /**
     * 获取状态文本
     */
    private getStatusText(): string {
        return "✅ 状态: 运行正常";
    }

    /**
     * 获取调试模式文本
     */
    private getTestText(): string {
        return this.runBrowserTest();
    }

    /**
     * 运行browser模块调试
     */
    private runBrowserTest(): string {
        try {
            // 动态导入browser模块进行调试
            import("../browser/index.js").then((browserModule) => {
                console.log("🔧 正在调试 browser 模块...");
                
                // 调用browser模块的功能
                if (browserModule.puppeteer) {
                    browserModule.puppeteer();
                }
                
                console.log("✅ browser 模块调试完成");
            }).catch((error) => {
                console.error("❌ browser 模块调试失败:", error);
            });
            
            return "🔧 已启动 browser 模块调试模式";
        } catch (error) {
            return `❌ 调试模式启动失败: ${error}`;
        }
    }

    /**
     * 检查是否是退出命令
     */
    isExitCommand(command: string): boolean {
        const trimmedCommand = command.trim().toLowerCase();
        return trimmedCommand === 'exit' || trimmedCommand === 'quit';
    }
}
