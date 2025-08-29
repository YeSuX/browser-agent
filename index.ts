#!/usr/bin/env bun

import { Command } from "commander";
import { createInterface } from "readline";
import { generateText } from "ai";
import { createDeepSeek } from "@ai-sdk/deepseek";

const deepseek = createDeepSeek({
  apiKey: process.env.DEEPSEEK_API_KEY,
});

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
  console.log('输入 "help" 查看可用命令，输入 "exit" 退出程序');
  console.log("💬 直接输入内容将发送给AI模型获取响应\n");

  const askQuestion = () => {
    rl.question("browser-agent> ", async (input) => {
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
        await handleUserInput(trimmedInput);
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
  console.log("\n💡 提示: 直接输入其他内容将发送给AI模型获取响应");
}

// 处理用户输入
async function handleUserInput(input: string) {
  console.log(`📝 收到输入: ${input}`);

  // 处理特殊命令
  if (input === "version") {
    console.log("📦 版本: 1.0.0");
  } else if (input === "status") {
    console.log("✅ 状态: 运行正常");
  } else {
    // 发送给AI模型
    console.log("🤖 正在发送给AI模型...");
    try {
      const response = await sendToLLM(input);
      console.log("📤 AI原始响应:");
      console.log(response);
    } catch (error) {
      console.error("❌ 调用AI模型失败:", error);
    }
  }

  console.log(""); // 空行分隔
}

// 发送用户输入给LLM并返回原始响应
// 发送用户输入给LLM并返回原始响应
async function sendToLLM(userInput: string): Promise<string> {
  try {
    // generateText 需要传递 messages 数组而不是 prompt
    const result = await generateText({
      model: deepseek("deepseek-chat"),
      messages: [{ role: "user", content: userInput }],
    });

    return result.text;
  } catch (error) {
    throw new Error(`AI模型调用失败: ${error}`);
  }
}

// 添加命令行选项
program
  .option("-i, --interactive", "启动交互式模式")
  .option("-c, --command <command>", "执行指定命令")
  .option("-a, --ai <input>", "直接发送内容给AI模型");

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
} else if (options.ai) {
  // 直接发送给AI模型
  console.log(`🤖 发送内容给AI模型: ${options.ai}`);
  sendToLLM(options.ai)
    .then((response) => {
      console.log("📤 AI原始响应:");
      console.log(response);
    })
    .catch((error) => {
      console.error("❌ 调用AI模型失败:", error);
    });
} else {
  // 默认显示帮助信息
  program.help();
}
