import { useState, useRef, useEffect } from "react"
import { Input, Button, message } from "antd"
import styles from "./Chat.module.css" 
import { sendMessage } from "../api/chat"

interface Message{
    id: number
    role: "user" | "ai"
    content: string
}

export default function Chat() {
    const [input, setInput] = useState("")
    const [messages, setMessages] = useState<Message[]>([])
    const contentRef = useRef("")
    const updateTimerRef = useRef<number | null>(null)
    const aiMessageIdRef = useRef<number>(0)
    const [loading, setLoading] = useState(false)
    const abortControllerRef = useRef<AbortController | null>(null)
    const isAbortedRef = useRef(false)
    const messagesContainerRef = useRef<HTMLDivElement>(null)
    const { TextArea } = Input
    const [messageApi, contextHolder] = message.useMessage()

    const flushContent = () => {
        setMessages((prev) => {
            return prev.map((msg) => 
                msg.id === aiMessageIdRef.current ? {...msg, content: contentRef.current} : msg
            )
        })
    }

    useEffect(() => {
        const container = messagesContainerRef.current
        if (container) {
            // 滚动到最底部
            container.scrollTop = container.scrollHeight
        }
    }, [messages])

    const handleSend = async () => {
        if (!input.trim() || loading) return 
        
        abortControllerRef.current = new AbortController()
        isAbortedRef.current = false
        
        const userMessage = {id: Date.now(), role: "user" as const, content: input}
        setMessages((prev) => [...prev, userMessage])
        setInput("")
        
        const aiMessageId = Date.now() + 1
        aiMessageIdRef.current = aiMessageId
        setMessages((prev) => [...prev, {id: aiMessageId, role: "ai" as const, content: ""}])
        setLoading(true)

        contentRef.current = ""
        if (updateTimerRef.current) clearInterval(updateTimerRef.current)
        updateTimerRef.current = window.setInterval(flushContent, 20)

        try {
            await sendMessage(userMessage.content, (chunk) => {
                contentRef.current += chunk
            }, abortControllerRef.current.signal)
        } catch {
            if (!isAbortedRef.current) {
                contentRef.current = "AI回复失败"
            }
        } finally {
            clearInterval(updateTimerRef.current)
            flushContent()
            setLoading(false)
            abortControllerRef.current = null
        }
    }

    const handleStop = () => {
        if (abortControllerRef.current) {
            isAbortedRef.current = true
            abortControllerRef.current.abort()
            clearInterval(updateTimerRef.current)
            setLoading(false)
            abortControllerRef.current = null
            messageApi.info("已停止")
        }
    }

    return (
        <>
            {contextHolder}
            <div className={styles.container}>
                <div className={styles.header}>AI 聊天系统</div>
                <div className={styles.messages} ref={messagesContainerRef}>
                    {messages.map((msg) => {
                        return <div
                            key={msg.id}
                            className={msg.role === "user" ? styles.userMsg : styles.aiMsg}
                        >
                            {msg.content}
                        </div>
                    })}
                </div>
                <div className={styles.inputArea}>
                    <TextArea 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onPressEnter={(e) => {
                            e.preventDefault()
                            handleSend()
                        }}
                        placeholder="请输入消息……"
                        rows={3}
                        disabled={loading}
                    />
                    {loading ? (
                        <Button type="primary" danger onClick={handleStop}>停止</Button>
                    ) : (
                        <Button type="primary" onClick={handleSend}>发送</Button>
                    )}
                </div>
            </div>
        </>
    )
}
