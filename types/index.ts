/**
 * Browser Agent 类型定义
 */

// AI 相关类型
export interface AIMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

export interface AIConfig {
    apiKey: string;
    model?: string;
    temperature?: number;
    maxTokens?: number;
}

// CLI 相关类型
export interface CLIConfig {
    interactive?: boolean;
    command?: string;
    verbose?: boolean;
}

// Agent 核心类型
export interface BrowserAgentConfig {
    ai: AIConfig;
    cli: CLIConfig;
}

export interface AgentResponse {
    success: boolean;
    data?: any;
    error?: string;
}

// 命令类型
export type CommandType = 'help' | 'version' | 'status' | 'exit' | 'quit';

// 事件类型
export interface AgentEvent {
    type: 'input' | 'output' | 'error' | 'complete';
    data: any;
    timestamp: Date;
}
