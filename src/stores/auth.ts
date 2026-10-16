import { ref } from 'vue'
import { defineStore } from 'pinia'

function leerUsuario() {
    const usuarioGuardado = localStorage.getItem('usuario')
    if (!usuarioGuardado) return null

    try {
        return JSON.parse(usuarioGuardado) as Record<string, any>
    } catch {
        localStorage.removeItem('usuario')
        return null
    }
}

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
    const user = ref<Record<string, any> | null>(leerUsuario())
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
            localStorage.setItem('usuario', JSON.stringify(normalizedUser))
        }
    }

    function logout() {
        user.value = null
        token.value = null
        localStorage.removeItem('token')
        localStorage.removeItem('usuario')
    }

    return { user, token, login, logout }
})