import { create } from "zustand"
import { persist } from "zustand/middleware"

interface UserState { 
    username: string | null
    token: string | null
    setUser: (username: string | null, token: string | null) => void
    logout: () => void
}

export const useUserStore = create<UserState>()(
    persist(
        (set) => ({
            username: null,
            token: null,
            setUser: (username, token) => set({username, token}),
            logout: () => set({ username: null, token: null })
        }),
        {name: 'user-storage' }
    )
)  
export default useUserStore