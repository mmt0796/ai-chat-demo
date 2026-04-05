import { readFileSync, writeFileSync, existsSync } from "fs";

interface User {
    username: string;
    password: string;
    createdAt: string;
}

const USERS_FILE = "./src/data/users.json";

export function loadUsers(): User[] {
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

export function saveUsers(users: User[]): void {
    writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), "utf-8");
}

export function generateToken(username: string): string {
    return Buffer.from(`${username}:${Date.now()}`).toString("base64");
}

export function findUser(username: string, password: string): User | undefined {
    const users = loadUsers();
    return users.find((u) => u.username === username && u.password === password);
}

export function findUserByUsername(username: string): User | undefined {
    const users = loadUsers();
    return users.find((u) => u.username === username);
}

export function createUser(username: string, password: string): User {
    const users = loadUsers();
    const newUser: User = {
        username,
        password,
        createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    saveUsers(users);
    return newUser;
}