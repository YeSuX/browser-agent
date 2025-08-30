#!/usr/bin/env bun

/**
 * Browser Agent 主入口文件
 * 支持作为CLI工具和npm包使用
 */

import { getRequiredEnvVar } from "./src/utils/index.js";
import { createBrowserAgent } from "./src/core/agent.js";
import { createCLIProgram, parseCLIArgs } from "./src/cli/index.js";
import type { BrowserAgentConfig } from "./types/index.js";

// 检查必需的环境变量
try {
  const apiKey = getRequiredEnvVar("DEEPSEEK_API_KEY");
} catch (error) {
  console.error("❌ 请设置 DEEPSEEK_API_KEY 环境变量");
  console.error("例如: export DEEPSEEK_API_KEY='your-api-key'");
  process.exit(1);
}

// 创建CLI程序
const program = createCLIProgram({});

// 解析命令行参数
const cliConfig = parseCLIArgs(program);

// 创建Browser Agent配置
const config: BrowserAgentConfig = {
  ai: {
    apiKey: process.env.DEEPSEEK_API_KEY!,
    model: "deepseek-chat",
  },
  cli: cliConfig,
};

// 创建并启动Agent
const agent = createBrowserAgent(config);

agent.start().catch((error) => {
  console.error("❌ Agent启动失败:", error);
  process.exit(1);
});
