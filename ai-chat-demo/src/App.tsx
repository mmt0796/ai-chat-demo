import { RouterProvider } from "react-router-dom"
import { router } from "./router"
import zhCN from "antd/es/locale/zh_CN"
import { ConfigProvider } from "antd"

function App() {
  return (
    <ConfigProvider locale={zhCN}>
      <RouterProvider router={router} />
    </ConfigProvider>
  )
}

export default App