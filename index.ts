#!/usr/bin/env bun

import { Command } from "commander";
import { createInterface } from "readline";

// 创建命令行程序实例
const program = new Command();

// 设置程序基本信息
program
  .name("browser-agent")
  .description("浏览器自动化代理工具")
  .version("1.0.0");

// 创建交互式命令行界面
function createInteractiveCLI() {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  console.log("🚀 欢迎使用 Browser Agent!");
  console.log('输入 "help" 查看可用命令，输入 "exit" 退出程序\n');

  const askQuestion = () => {
    rl.question("browser-agent> ", (input) => {
      const trimmedInput = input.trim();

      if (trimmedInput === "exit" || trimmedInput === "quit") {
        console.log("👋 再见！");
        rl.close();
        process.exit(0);
      }

      if (trimmedInput === "help") {
        showHelp();
      } else if (trimmedInput === "") {
        // 空输入，继续询问
      } else {
        // 处理用户输入
        handleUserInput(trimmedInput);
      }

      askQuestion();
    });
  };

  askQuestion();
}

// 显示帮助信息
function showHelp() {
  console.log("\n📖 可用命令:");
  console.log("  help     - 显示此帮助信息");
  console.log("  exit     - 退出程序");
  console.log("  quit     - 退出程序");
  console.log("  version  - 显示版本信息");
  console.log("  status   - 显示当前状态");
  console.log("\n💡 提示: 你也可以直接输入其他内容，程序会处理你的输入");
}

// 处理用户输入
function handleUserInput(input: string) {
  console.log(`📝 收到输入: ${input}`);

  // 这里可以添加具体的业务逻辑
  // 例如：解析命令、执行操作等

  if (input === "version") {
    console.log("📦 版本: 1.0.0");
  } else if (input === "status") {
    console.log("✅ 状态: 运行正常");
  } else {
    console.log(`🔍 处理输入: "${input}"`);
    // 这里可以添加更多的输入处理逻辑
  }

  console.log(""); // 空行分隔
}

// 添加命令行选项
program
  .option("-i, --interactive", "启动交互式模式")
  .option("-c, --command <command>", "执行指定命令");

// 处理命令行参数
program.parse();

const options = program.opts();

// 根据选项决定运行模式
if (options.interactive) {
  // 交互式模式
  createInteractiveCLI();
} else if (options.command) {
  // 执行指定命令
  console.log(`🚀 执行命令: ${options.command}`);
  handleUserInput(options.command);
} else {
  // 默认显示帮助信息
  program.help();
}
