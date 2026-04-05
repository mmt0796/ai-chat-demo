# AI Chat Demo

基于 React + TypeScript + Vite 的 AI 聊天应用，集成讯飞星火大模型 API。

## 功能特性

- 💬 **实时对话** - 支持与 AI 进行流式对话
- ⏹️ **停止生成** - 可随时中断 AI 回复
- 📜 **自动滚动** - 消息自动滚动到底部
- 🔐 **用户认证** - 登录/注册功能
- 🎨 **Markdown 支持** - AI 回复支持 Markdown 渲染
- 📱 **响应式布局** - 适配不同屏幕尺寸

## 技术栈

| 技术 | 说明 |
|------|------|
| React 19 | UI 框架 |
| TypeScript | 类型安全 |
| Vite | 打包工具 |
| Ant Design 5 | UI 组件库 |
| React Router | 路由管理 |
| Zustand | 状态管理 |
| 讯飞星火 API | AI 大模型 |

## 项目结构

```
react-demo/
├── ai-chat-demo/      # 前端项目
│   ├── src/
│   │   ├── api/       # API 请求
│   │   ├── pages/     # 页面组件
│   │   ├── store/     # 状态管理
│   │   └── router/    # 路由配置
│   └── vite.config.ts
└── server/             # 后端服务
    └── src/
        ├── routes/    # API 路由
        ├── services/  # 业务逻辑
        └── data/      # 数据存储
```

## 快速开始

### 1. 安装前端依赖

```bash
cd ai-chat-demo
npm install
```

### 2. 安装后端依赖

```bash
cd server
npm install
```

### 3. 配置 API Key

在 `server/src/index.ts` 文件中修改：

```typescript
const API_KEY = "您的api_key";
```

### 4. 启动后端

```bash
cd server
npm run dev
```

### 5. 启动前端

```bash
cd ai-chat-demo
npm run dev
```

## API 接口

| 接口 | 方法 | 说明 |
|------|------|------|
| `/api/register` | POST | 用户注册 |
| `/api/login` | POST | 用户登录 |
| `/api/chat` | POST | AI 对话 |

## 许可证

MIT
