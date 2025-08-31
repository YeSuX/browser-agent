/**
 * Browser Agent 类型定义
 */

// AI 相关类型
export interface AIMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface AIConfig {
  apiKey: string;
  model?: string;
}

// CLI 相关类型
export interface CLIConfig {
  interactive?: boolean;
  command?: string;
}

// Agent 核心类型
export interface BrowserAgentConfig {
  ai: AIConfig;
  cli: CLIConfig;
}

// 命令类型
export type CommandType =
  | "help"
  | "version"
  | "status"
  | "exit"
  | "quit"
  | "debug";
