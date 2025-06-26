import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// O 'persist' middleware salva o estado no localStorage do navegador,
// mantendo o usuário logado mesmo que ele atualize a página.
export const useAuthStore = create(
    persist(
        (set) => ({
            token: null,
            user: null,
            setToken: (token) => set({ token }),
            setUser: (user) => set({ user }),
            logout: () => set({ token: null, user: null }),
        }),
        {
            name: 'auth-storage', // Nome do item no localStorage
        }
    )
);