import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', () => {
    const user = ref<Record<string, any> | null>(null)
    const token = ref<string | null>(localStorage.getItem('token') || null)

    function login(userData: Record<string, any> | null, userToken: string | null) {
        user.value = userData
        token.value = userToken
        if (userToken) {
            localStorage.setItem('token', userToken)
        }
    }

    function logout() {
        user.value = null
        token.value = null
        localStorage.removeItem('token')
    }

    return { user, token, login, logout }
})