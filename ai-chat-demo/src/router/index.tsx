import { createBrowserRouter, redirect } from "react-router-dom"
import Login from "../pages/Login"
import Register from "../pages/Register"
import Chat from "../pages/Chat"

export const router = createBrowserRouter([
    {
        path: "/",
        loader: () => redirect("/login")
    },
    { path: "/login", element: <Login />},
    { path: "/register", element: <Register />},
    { path: "/chat", element: <Chat />}
])