# Browser Agent

一个基于AI的浏览器自动化代理工具，支持命令行交互和程序化调用。

## 🚀 特性

- 🤖 集成DeepSeek AI模型
- 💬 交互式命令行界面
- 📦 支持npm包发布
- 🔧 模块化架构，易于扩展
- ⚡ 支持流式输出
- 🛠️ TypeScript支持

## 📁 项目结构

```
browser-agent/
├── src/                    # 源代码目录
│   ├── ai/                # AI相关模块
│   │   └── provider.ts    # AI提供商实现
│   ├── cli/               # 命令行界面模块
│   │   ├── commands.ts    # 命令处理
│   │   └── index.ts       # CLI界面
│   ├── core/              # 核心功能模块
│   │   └── agent.ts       # 核心Agent类
│   ├── utils/             # 工具函数
│   │   └── index.ts       # 工具函数集合
│   └── index.ts           # 库入口文件
├── types/                 # 类型定义
│   └── index.ts           # TypeScript类型定义
├── lib/                   # 编译输出目录
├── bin/                   # 可执行文件目录
│   └── browser-agent.js   # npm bin入口
├── index.ts               # 主入口文件
├── package.json           # 项目配置
├── tsconfig.json          # TypeScript配置
└── README.md              # 项目文档
```

## 🛠️ 安装

### 作为CLI工具使用

```bash
# 全局安装
npm install -g browser-agent

# 或使用bun
bun add -g browser-agent
```

### 作为依赖使用

```bash
npm install browser-agent

# 或使用bun
bun add browser-agent
```

## ⚙️ 配置

在使用前，请设置DeepSeek API密钥：

```bash
export DEEPSEEK_API_KEY="your-api-key-here"
```

## 📖 使用方法

### CLI模式

```bash
# 启动交互式模式
browser-agent -i

# 执行特定命令
browser-agent -c "帮我分析一下这个网页"

# 显示帮助信息
browser-agent --help
```

### 交互式模式命令

在交互式模式中，你可以使用以下命令：

- `help` - 显示帮助信息
- `version` - 显示版本信息
- `status` - 显示当前状态
- `exit` 或 `quit` - 退出程序
- 其他任何输入都会发送给AI模型处理

### 程序化使用

```typescript
import { createBrowserAgent, createAIProvider } from 'browser-agent';

// 创建AI提供商
const aiProvider = createAIProvider({
  apiKey: process.env.DEEPSEEK_API_KEY!,
  model: 'deepseek-chat'
});

// 简单问答
const response = await aiProvider.ask('你好！');

// 创建完整Agent
const agent = createBrowserAgent({
  ai: {
    apiKey: process.env.DEEPSEEK_API_KEY!,
  },
  cli: {
    interactive: true
  }
});

await agent.start();
```

## 🏗️ 开发

### 环境要求

- Node.js >= 18.0.0
- Bun >= 1.0.0
- TypeScript >= 5.0.0

### 本地开发

```bash
# 安装依赖
bun install

# 开发模式运行
bun run dev

# 构建项目
bun run build

# 发布到npm
npm publish
```

### 项目结构说明

- **AI模块** (`src/ai/`): 封装AI模型调用，支持流式和非流式输出
- **CLI模块** (`src/cli/`): 处理命令行界面和用户交互
- **核心模块** (`src/core/`): 整合所有功能的核心Agent类
- **工具模块** (`src/utils/`): 提供通用的工具函数
- **类型定义** (`types/`): TypeScript类型定义，确保类型安全

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交Issue和Pull Request！

## 📞 支持

如果遇到问题，请：

1. 查看[Issues](../../issues)页面
2. 提交新的Issue
3. 联系维护者
