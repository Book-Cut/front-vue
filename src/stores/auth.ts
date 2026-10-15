import { ref, computed } from "vue";
import { defineStore } from "pinia";

function getUserDisplayName(userData: Record<string, any> | null) {
  if (!userData) return "Usuario";

  return (
    userData.name ??
    userData.nombre ??
    userData.Nombre ??
    userData.Nombres ??
    "Usuario"
  );
}

function leerUsuarioGuardado(): Record<string, any> | null {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
}

export const useAuthStore = defineStore("auth", () => {
  const user = ref<Record<string, any> | null>(leerUsuarioGuardado());
  const token = ref<string | null>(localStorage.getItem("token") || null);

  const autenticado = computed(() => !!token.value);

  function login(
    userData: Record<string, any> | null,
    userToken: string | null,
  ) {
    const normalizedUser = userData
      ? {
          ...userData,
          name: getUserDisplayName(userData),
        }
      : null;

    user.value = normalizedUser;
    token.value = userToken;
    if (userToken) {
      localStorage.setItem("token", userToken);
    }
    if (normalizedUser) {
      localStorage.setItem("user", JSON.stringify(normalizedUser));
    }
  }

  function logout() {
    user.value = null;
    token.value = null;
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }

  return { user, token, autenticado, login, logout };
});
