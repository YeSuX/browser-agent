# Browser Agent CLI

一个功能强大的浏览器自动化代理工具，提供命令行界面和交互式操作，支持 AI 模型调用。

## 🚀 快速开始

### 安装依赖

```bash
bun install
```

### 配置环境变量

在使用 AI 功能前，需要设置 DeepSeek API 密钥：

```bash
export DEEPSEEK_API_KEY="your_api_key_here"
```

### 运行 CLI 工具

#### 方式 1: 使用 bun 直接运行

```bash
bun run start
```

#### 方式 2: 交互式模式

```bash
bun run index.ts --interactive
```

#### 方式 3: 执行指定命令

```bash
bun run index.ts --command "status"
```

#### 方式 4: 直接发送内容给 AI 模型

```bash
bun run index.ts --ai "你好，请介绍一下自己"
```

#### 方式 5: 开发模式（自动重启）

```bash
bun run dev
```

## 📖 使用说明

### 交互式模式

启动交互式模式后，你可以：

- 输入 `help` 查看可用命令
- 输入 `version` 查看版本信息
- 输入 `status` 查看当前状态
- 输入 `exit` 或 `quit` 退出程序
- **直接输入其他内容，将自动发送给 AI 模型获取响应**

### 命令行选项

- `-i, --interactive`: 启动交互式模式
- `-c, --command <command>`: 执行指定命令
- `-a, --ai <input>`: 直接发送内容给 AI 模型
- `-v, --verbose`: 显示详细输出
- `-h, --help`: 显示帮助信息
- `-V, --version`: 显示版本信息

### 示例用法

```bash
# 显示帮助信息
bun run index.ts --help

# 启动交互式模式
bun run index.ts -i

# 执行特定命令
bun run index.ts -c "status"

# 直接发送内容给AI模型
bun run index.ts -a "请解释什么是人工智能"

# 显示版本信息
bun run index.ts -V
```

## 🤖 AI 功能

### 支持的模型

- **DeepSeek Chat**: 使用 DeepSeek 的聊天模型
- 自动处理用户输入并返回 AI 原始响应
- 支持中文和英文输入

### 使用方式

1. **交互式模式**: 启动后直接输入问题
2. **命令行模式**: 使用 `--ai` 参数直接发送内容
3. **自动响应**: 程序会自动调用 AI 模型并显示原始响应

## 🛠️ 开发

### 项目结构

```
browser-agent/
├── index.ts          # 主入口文件
├── package.json      # 项目配置
├── tsconfig.json     # TypeScript 配置
└── README.md         # 说明文档
```

### 技术栈

- **Bun**: 运行时环境
- **TypeScript**: 开发语言
- **Commander**: CLI 框架
- **Node.js readline**: 交互式输入
- **AI SDK**: AI 模型调用
- **DeepSeek**: AI 模型提供商

### 扩展功能

在 `handleUserInput` 函数中添加你的业务逻辑，处理用户输入并执行相应操作。AI 功能已集成到主流程中。

## 📝 注意事项

- 确保设置了正确的 `DEEPSEEK_API_KEY` 环境变量
- AI 响应可能需要几秒钟时间，请耐心等待
- 如果 API 调用失败，会显示详细的错误信息

## �� 许可证

MIT License
