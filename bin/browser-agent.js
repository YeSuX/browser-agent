#!/usr/bin/env node

/**
 * Browser Agent 可执行文件
 * 用于npm包的bin入口
 */

import { createRequire } from "module";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 动态导入主模块
const mainModulePath = join(__dirname, "../lib/index.js");

try {
  // 对于ES模块，使用动态导入
  const { default: main } = await import(mainModulePath);
  if (typeof main === "function") {
    main();
  }
} catch (error) {
  console.error("❌ 启动失败:", error);
  process.exit(1);
}
