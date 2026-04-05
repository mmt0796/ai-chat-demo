import { Form, Input, Button, Card, message } from "antd"
import styles from "./Register.module.css"
import { useNavigate } from "react-router-dom"
import { register } from "../api/user"

export default function Register() {
    const navigate = useNavigate()
    const [form] = Form.useForm()
    const [messageApi, contextHolder] = message.useMessage()
    const onFinish = async (values: {
        username: string
        password: string
        confirmPassword: string
    }) => {
        try {
            const res = await register(values)
            if ( res.code === 0 ) {
                messageApi.success("注册成功!")
                navigate("/login")
            } else {
                messageApi.error(res.message || "注册失败！")
            }
        } catch (error) {
            messageApi.error(error.message || "注册失败！")
        }
    }

    return (
        <>
            {contextHolder}
            <div className={styles.container}>
                <Card title="注册" style={{width: 400}}>
                    <Form form={form} onFinish={onFinish} labelCol={{span: 6}} wrapperCol={{span: 18}}>
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
                        <Form.Item 
                            name="confirmPassword" 
                            label="确认密码" 
                            rules={[
                                { required: true, message: "请确认密码" },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || value === getFieldValue("password")) {
                                            return Promise.resolve()
                                        }
                                        return Promise.reject("两次密码不一致")
                                    }
                                })
                            ]}
                        >
                            <Input placeholder="请确认密码" />
                        </Form.Item>
                        <Button type="primary" htmlType="submit" block>注册</Button>
                        <div style={{textAlign: "center", paddingTop: "16px"}}>
                            已有账号？
                            <a onClick={() => navigate("/login")}>去登录</a>
                        </div>
                    </Form>
                </Card>
            </div>
        </>
    )
}