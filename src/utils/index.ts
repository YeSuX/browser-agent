/**
 * 工具函数模块
 */

/**
 * 检查环境变量是否存在
 */
export function checkEnvVar(name: string): boolean {
    return !!process.env[name];
}

/**
 * 获取环境变量，如果不存在则抛出错误
 */
export function getRequiredEnvVar(name: string): string {
    const value = process.env[name];
    if (!value) {
        throw new Error(`环境变量 ${name} 未设置`);
    }
    return value;
}

/**
 * 获取环境变量，如果不存在则返回默认值
 */
export function getEnvVar(name: string, defaultValue: string = ""): string {
    return process.env[name] || defaultValue;
}

/**
 * 格式化输出
 */
export class OutputFormatter {
    static success(message: string): void {
        console.log(`✅ ${message}`);
    }

    static error(message: string): void {
        console.error(`❌ ${message}`);
    }

    static info(message: string): void {
        console.log(`ℹ️  ${message}`);
    }

    static warning(message: string): void {
        console.warn(`⚠️  ${message}`);
    }
}

/**
 * 异步延迟
 */
export function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 重试函数
 */
export async function retry<T>(
    fn: () => Promise<T>,
    maxRetries: number = 3,
    delayMs: number = 1000
): Promise<T> {
    let lastError: Error;

    for (let i = 0; i < maxRetries; i++) {
        try {
            return await fn();
        } catch (error) {
            lastError = error as Error;
            if (i < maxRetries - 1) {
                await delay(delayMs);
            }
        }
    }

    throw lastError!;
}
