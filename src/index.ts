/**
 * Browser Agent 库入口文件
 * 导出所有公开的API
 */

// 导出类型
export type {
    AIMessage,
    AIConfig,
    CLIConfig,
    BrowserAgentConfig,
    CommandType,
} from "../types/index.js";

// 导出AI相关功能
export { AIProvider } from "./ai/provider.js";

// 导出CLI相关功能
export { CLIInterface, createCLIProgram, parseCLIArgs } from "./cli/index.js";
export { CommandHandler } from "./cli/commands.js";

// 导出核心功能
export { BrowserAgent, createBrowserAgent } from "./core/agent.js";

// 导出工具函数
export {
    getRequiredEnvVar,
} from "./utils/index.js";
