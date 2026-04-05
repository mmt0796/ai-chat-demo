export const sendMessage = async (
    message: string, 
    onChunk: (content: string) => void,
    signal?: AbortSignal
) => {
    const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ message }),
        signal
    })

    const reader = response.body?.getReader()
    const decoder = new TextDecoder()

    if (reader) {
        while (true) {
            if (signal?.aborted) break
            
            const { done, value } = await reader.read()
            if (done) break

            const chunk = decoder.decode(value)
            const lines = chunk.split("\n")

            for (const line of lines) {
                if (line.startsWith("data:")) {
                    const data = line.slice(5).trim()
                    if (data === "[DONE]") break
                    try {
                        const parsed = JSON.parse(data)
                        const content = parsed.choices?.[0]?.delta?.content
                        if (content) {
                            onChunk(content)
                        }
                    } catch (error) {
                        console.error("Error parsing JSON:", error)
                    }
                }
            }
        }
    }
}
