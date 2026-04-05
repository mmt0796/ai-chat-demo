import { Form, Input, Button, Card, message } from "antd"
import styles from "./Login.module.css"
import { useNavigate } from "react-router-dom"
import { login } from "../api/user"
import { useUserStore } from "../store/user"
import { useEffect } from "react"
import "antd/dist/reset.css" 

export default function Login() {
    const navigate = useNavigate()
    const [form] = Form.useForm()
    const setUser = useUserStore((state) => state.setUser)
    const [messageApi, contextHolder] = message.useMessage()
    const onFinish = async (values: {
        username: string
        password: string
    }) => {
        console.log("表单提交了", values)
        messageApi.info("正在登录中...")
        try {
            const res = await login(values)
            console.log("登录结果", res)
            if ( res.code === 0 ) {
                setUser(res.data.username, res.data.token)
                messageApi.success("登录成功!")
                navigate("/chat")
            } else {
                messageApi.error(res.message || "登录失败！")
            }
            
        } catch (error) {
            messageApi.error("登陆失败！")
        }
    }

    return (
        <>
            {contextHolder}
            <div className={styles.container}>
                <Card title="登录" style={{width: 400}}>
                    <Form form={form} onFinish={onFinish} labelCol={{span: 5}} wrapperCol={{span: 18}}>
                        <Form.Item 
                            name="username" 
                            label="用户名" 
                            rules={[{ required: true, message: "请输入用户名"}]}
                        >
                            <Input placeholder="请输入用户名" />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            label="密码"
                            rules={[{ required: true, message: "请输入密码"}]}
                        >
                            <Input placeholder="请输入密码" />
                        </Form.Item>
                        <Button type="primary" htmlType="submit" block>登录</Button>
                        <div style={{ textAlign: "center", paddingTop: "16px"}}>
                            还没有账号?
                            <a onClick= {() => navigate("/register")}>去注册</a>
                        </div>
                    </Form>
                </Card>
            </div>
        </>
    )
    
}