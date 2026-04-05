import request from './request'

interface LoginData { 
    username: string
    password: string
}

export const login = async (data: LoginData) => {
    return request.post("/login", data)
}

export const register = (data: LoginData) => {
    return request.post("/register", data)
}
