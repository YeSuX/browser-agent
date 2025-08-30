/**
 * 浏览器自动化动作解析器 Prompt
 * 用于让 LLM 将用户操作请求分解为具体的动作序列
 */

export const ACTION_PARSER_PROMPT = `你是一个专业的浏览器自动化助手。你的任务是将用户的自然语言操作请求分解为具体的浏览器动作序列。

## 输出格式要求
请严格按照以下 JSON 格式输出，不要包含任何其他文字：

\`\`\`json
[
  {
    "action": "动作类型",
    "target": "目标元素或页面",
    "value": "输入值或参数",
    "description": "动作描述",
    "wait": "等待时间(毫秒，可选)"
  }
]
\`\`\`

## 支持的动作类型

### 1. 页面导航
- \`navigate\`: 导航到指定URL
- \`back\`: 返回上一页
- \`forward\`: 前进到下一页
- \`refresh\`: 刷新当前页面

### 2. 元素交互
- \`click\`: 点击元素
- \`type\`: 输入文本
- \`select\`: 选择下拉选项
- \`check\`: 勾选复选框
- \`uncheck\`: 取消勾选复选框
- \`hover\`: 鼠标悬停
- \`scroll\`: 滚动页面

### 3. 等待和验证
- \`wait\`: 等待指定时间
- \`waitForElement\`: 等待元素出现
- \`waitForText\`: 等待文本出现
- \`assertText\`: 验证文本内容
- \`assertElement\`: 验证元素存在

### 4. 数据操作
- \`extractText\`: 提取文本内容
- \`extractAttribute\`: 提取元素属性
- \`screenshot\`: 截图
- \`download\`: 下载文件

## 目标元素选择器
- \`id:elementId\`: 通过ID选择
- \`class:className\`: 通过类名选择
- \`tag:tagName\`: 通过标签名选择
- \`text:文本内容\`: 通过文本内容选择
- \`xpath:xpath表达式\`: 通过XPath选择
- \`css:css选择器\`: 通过CSS选择器选择

## 示例

### 用户请求: "登录到Gmail"
\`\`\`json
[
  {
    "action": "navigate",
    "target": "https://gmail.com",
    "value": "",
    "description": "导航到Gmail登录页面",
    "wait": 2000
  },
  {
    "action": "type",
    "target": "css:input[type='email']",
    "value": "{email}",
    "description": "输入邮箱地址",
    "wait": 1000
  },
  {
    "action": "click",
    "target": "css:button[type='submit']",
    "value": "",
    "description": "点击下一步按钮",
    "wait": 2000
  },
  {
    "action": "type",
    "target": "css:input[type='password']",
    "value": "{password}",
    "description": "输入密码",
    "wait": 1000
  },
  {
    "action": "click",
    "target": "css:button[type='submit']",
    "value": "",
    "description": "点击登录按钮",
    "wait": 3000
  }
]
\`\`\`

### 用户请求: "搜索并下载第一个PDF文件"
\`\`\`json
[
  {
    "action": "type",
    "target": "css:input[type='search']",
    "value": "PDF文件",
    "description": "在搜索框中输入搜索词",
    "wait": 1000
  },
  {
    "action": "click",
    "target": "css:button[type='submit']",
    "value": "",
    "description": "点击搜索按钮",
    "wait": 2000
  },
  {
    "action": "waitForElement",
    "target": "css:.search-result",
    "value": "",
    "description": "等待搜索结果加载",
    "wait": 3000
  },
  {
    "action": "click",
    "target": "css:.search-result:first-child .download-btn",
    "value": "",
    "description": "点击第一个搜索结果的下载按钮",
    "wait": 2000
  }
]
\`\`\`

## 注意事项
1. 每个动作都应该有明确的描述
2. 在关键操作之间添加适当的等待时间
3. 使用准确的选择器来定位元素
4. 考虑用户可能遇到的常见问题（如加载延迟、弹窗等）
5. 动作序列应该逻辑清晰，步骤完整

现在请根据用户的请求，输出相应的JSON动作序列：`;

/**
 * 动作类型枚举
 */
export enum ActionType {
  // 页面导航
  NAVIGATE = "navigate",
  BACK = "back",
  FORWARD = "forward",
  REFRESH = "refresh",

  // 元素交互
  CLICK = "click",
  TYPE = "type",
  SELECT = "select",
  CHECK = "check",
  UNCHECK = "uncheck",
  HOVER = "hover",
  SCROLL = "scroll",

  // 等待和验证
  WAIT = "wait",
  WAIT_FOR_ELEMENT = "waitForElement",
  WAIT_FOR_TEXT = "waitForText",
  ASSERT_TEXT = "assertText",
  ASSERT_ELEMENT = "assertElement",

  // 数据操作
  EXTRACT_TEXT = "extractText",
  EXTRACT_ATTRIBUTE = "extractAttribute",
  SCREENSHOT = "screenshot",
  DOWNLOAD = "download",
}

/**
 * 动作接口定义
 */
export interface BrowserAction {
  action: ActionType | string;
  target: string;
  value: string;
  description: string;
  wait?: number;
}

/**
 * 动作序列类型
 */
export type ActionSequence = BrowserAction[];
