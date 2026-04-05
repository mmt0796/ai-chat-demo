import Mock from "mockjs"

Mock.setup({
    timeout: 500  // 模拟网络延迟
})

const users = JSON.parse(localStorage.getItem("mock-users") || "[]")

Mock.mock("/api/login", "post", (options: any) => {
    const { username, password } = JSON.parse(options.body)
    const user = users.find((u: any) => u.username === username && u.password === password)
    
    if (user) {
        return {
            code: 0,
            data: {
                username: user.username,
                token: "mock-token-" + Date.now()
            }
        }
    }
    return {
        code: 1,
        message: "用户名或密码错误"
    }
})

Mock.mock("/api/register", "post", (options: any) => {
    const { username, password } = JSON.parse(options.body)
    
    if (users.find((u: any) => u.username === username)) {
        return {
            code: 1,
            message: "用户名已存在"
        }
    }
    
    users.push({ username, password })
    localStorage.setItem("mock-users", JSON.stringify(users))
    
    return {
        code: 0,
        data: { username }
    }
})