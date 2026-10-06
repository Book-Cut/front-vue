import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', () => {
    const user = ref(null)
    const token = ref(localStorage.getItem('token') || null)

    function login(userData, userToken) {
        user.value = userData
        token.value = userToken
        localStorage.setItem('token', userToken)
    }

    function logout() {
        user.value = null
        token.value = null
        localStorage.removeItem('token')
    }

    return { user, token, login, logout }
})