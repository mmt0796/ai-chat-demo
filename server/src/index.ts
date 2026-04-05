import express from "express";
import cors from "cors";
import { readFileSync, writeFileSync, existsSync } from "fs";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = "BqNWrGTDTsFWmfvLlXFl:BGZMiyUSKfkWdlNhJTCe";
const USERS_FILE = "./src/data/users.json";

interface User {
    username: string;
    password: string;
    createdAt: string;
}

function loadUsers(): User[] {
    if (existsSync(USERS_FILE)) {
        try {
            const data = readFileSync(USERS_FILE, "utf-8");
            return JSON.parse(data);
        } catch {
            return [];
        }
    }
    return [];
}

function saveUsers(users: User[]): void {
    writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), "utf-8");
}

function generateToken(username: string): string {
    return Buffer.from(`${username}:${Date.now()}`).toString("base64");
}

const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "AI Chat API",
            version: "1.0.0",
            description: "AI 聊天系统接口文档",
        },
        servers: [
            {
                url: "http://localhost:3000",
                description: "开发服务器",
            },
        ],
        tags: [
            { name: "用户", description: "用户注册和登录" },
            { name: "聊天", description: "AI 聊天接口" },
        ],
        components: {
            schemas: {
                User: {
                    type: "object",
                    properties: {
                        username: { type: "string", description: "用户名" },
                        password: { type: "string", description: "密码" },
                    },
                },
                LoginResponse: {
                    type: "object",
                    properties: {
                        code: { type: "integer", example: 0 },
                        data: {
                            type: "object",
                            properties: {
                                username: { type: "string" },
                                token: { type: "string" },
                            },
                        },
                    },
                },
                ErrorResponse: {
                    type: "object",
                    properties: {
                        code: { type: "integer", example: 1 },
                        message: { type: "string", example: "用户名或密码错误" },
                    },
                },
            },
        },
        paths: {
            "/api/register": {
                post: {
                    tags: ["用户"],
                    summary: "用户注册",
                    description: "注册一个新用户",
                    requestBody: {
                        required: true,
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    required: ["username", "password"],
                                    properties: {
                                        username: { type: "string", example: "zhangsan" },
                                        password: { type: "string", example: "123456" },
                                    },
                                },
                            },
                        },
                    },
                    responses: {
                        200: {
                            description: "注册成功",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            code: { type: "integer", example: 0 },
                                            data: {
                                                type: "object",
                                                properties: {
                                                    username: { type: "string" },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                        200: {
                            description: "注册失败",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            code: { type: "integer", example: 1 },
                                            message: { type: "string", example: "用户名已存在" },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
            "/api/login": {
                post: {
                    tags: ["用户"],
                    summary: "用户登录",
                    description: "登录并获取 token",
                    requestBody: {
                        required: true,
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    required: ["username", "password"],
                                    properties: {
                                        username: { type: "string", example: "zhangsan" },
                                        password: { type: "string", example: "123456" },
                                    },
                                },
                            },
                        },
                    },
                    responses: {
                        200: {
                            description: "登录成功",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            code: { type: "integer", example: 0 },
                                            data: {
                                                type: "object",
                                                properties: {
                                                    username: { type: "string" },
                                                    token: { type: "string" },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                        200: {
                            description: "登录失败",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            code: { type: "integer", example: 1 },
                                            message: { type: "string", example: "用户名或密码错误" },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
            "/api/chat": {
                post: {
                    tags: ["聊天"],
                    summary: "AI 聊天",
                    description: "发送消息给 AI，返回流式响应",
                    requestBody: {
                        required: true,
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    required: ["message"],
                                    properties: {
                                        message: { type: "string", example: "你好" },
                                    },
                                },
                            },
                        },
                    },
                    responses: {
                        200: {
                            description: "SSE 流式响应",
                            content: {
                                "text/event-stream": {
                                    schema: {
                                        type: "string",
                                        example: 'data: {"choices":[{"delta":{"content":"你好"}}]}',
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    },
    apis: [],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "AI Chat API 文档",
}));

app.get("/api-docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
});

app.post("/api/register", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.json({ code: 1, message: "用户名和密码不能为空" });
    }

    const users = loadUsers();

    const existingUser = users.find((u) => u.username === username);
    if (existingUser) {
        return res.json({ code: 1, message: "用户名已存在" });
    }

    const newUser: User = {
        username,
        password,
        createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    saveUsers(users);

    res.json({
        code: 0,
        data: { username: newUser.username },
    });
});

app.post("/api/login", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.json({ code: 1, message: "用户名和密码不能为空" });
    }

    const users = loadUsers();

    const user = users.find(
        (u) => u.username === username && u.password === password
    );

    if (!user) {
        return res.json({ code: 1, message: "用户名或密码错误" });
    }

    const token = generateToken(username);

    res.json({
        code: 0,
        data: {
            username: user.username,
            token,
        },
    });
});

app.post("/api/chat", async (req, res) => {
    const { message } = req.body;

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("Access-Control-Allow-Origin", "*");

    let isFinished = false;
    const finish = (data?: string) => {
        if (isFinished) return;
        isFinished = true;
        if (data) res.write(data);
        res.end();
    };

    try {
        const response = await fetch("https://spark-api-open.xf-yun.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: "generalv3.5",
                messages: [{ role: "user", content: message }],
                stream: true
            })
        });

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        if (reader) {
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);
                res.write(chunk);
            }
        }

        finish();
    } catch (err: any) {
        console.error("错误:", err.message);
        finish(`data: ${JSON.stringify({ error: err.message })}\n\n`);
    }
});

app.listen(3000, () => {
    console.log("服务器运行在 http://localhost:3000");
    console.log("API 文档: http://localhost:3000/api-docs");
});
