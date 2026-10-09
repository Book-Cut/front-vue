import { ref } from 'vue'
import { defineStore } from 'pinia'

function getUserDisplayName(userData: Record<string, any> | null) {
    if (!userData) return 'Usuario'

    return (
        userData.name ??
        userData.nombre ??
        userData.Nombre ??
        userData.Nombres ??
        'Usuario'
    )
}

export const useAuthStore = defineStore('auth', () => {
    const user = ref<Record<string, any> | null>(null)
    const token = ref<string | null>(localStorage.getItem('token') || null)

    function login(userData: Record<string, any> | null, userToken: string | null) {
        const normalizedUser = userData
            ? {
                ...userData,
                name: getUserDisplayName(userData),
            }
            : null

        user.value = normalizedUser
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