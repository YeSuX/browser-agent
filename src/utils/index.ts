/**
 * 工具函数模块
 */



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








