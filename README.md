# Browser Agent CLI

一个功能强大的浏览器自动化代理工具，提供命令行界面和交互式操作。

## 🚀 快速开始

### 安装依赖

```bash
bun install
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

#### 方式 4: 开发模式（自动重启）

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
- 输入其他内容，程序会处理你的输入

### 命令行选项

- `-i, --interactive`: 启动交互式模式
- `-c, --command <command>`: 执行指定命令
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

# 显示版本信息
bun run index.ts -V
```

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

### 扩展功能

在 `handleUserInput` 函数中添加你的业务逻辑，处理用户输入并执行相应操作。

## �� 许可证

MIT License
