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
ai-chat-demo/
├── src/
│   ├── api/           # API 请求
│   │   ├── chat.ts    # 聊天接口
│   │   ├── user.ts    # 用户接口
│   │   └── request.ts # 请求封装
│   ├── pages/         # 页面组件
│   │   ├── Chat.tsx   # 聊天页面
│   │   ├── Login.tsx  # 登录页面
│   │   └── Register.tsx # 注册页面
│   ├── store/         # 状态管理
│   │   └── user.ts    # 用户状态
│   ├── router/        # 路由配置
│   │   └── index.tsx
│   ├── App.tsx        # 根组件
│   └── main.tsx       # 入口文件
├── server/            # 后端服务
│   └── src/
│       ├── routes/    # API 路由
│       ├── services/  # 业务逻辑
│       └── data/      # 数据存储
├── vite.config.ts     # Vite 配置
└── package.json
```

## 快速开始

### 安装依赖

```bash
npm install
```

### 启动后端

```bash
cd server
npm install
npm run dev
```

### 启动前端

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

## 环境配置

### 前端 (.env)

```env
VITE_API_BASE=/api
```

### 后端 (.env)

```env
SPARK_APP_ID=your_app_id
SPARK_API_KEY=your_api_key
SPARK_API_SECRET=your_api_secret
```

## API 接口

| 接口 | 方法 | 说明 |
|------|------|------|
| `/api/register` | POST | 用户注册 |
| `/api/login` | POST | 用户登录 |
| `/api/chat` | POST | AI 对话 |

## 许可证

MIT
