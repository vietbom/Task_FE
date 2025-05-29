import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

interface User {
    id: number;
    userName: string;
    email: string;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
    signInLoading: boolean;
    signUpLoading: boolean;
    logoutLoading: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (userName: string, email: string, password: string) => Promise<void>;
    checkAuth: () => Promise<void>;
    logout: () => Promise<void>;
    clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: JSON.parse(localStorage.getItem("user") || "null"),
    isAuthenticated: localStorage.getItem("isAuthenticated") === "true",
    loading: false,
    error: null,
    signInLoading: false,
    signUpLoading: false,
    logoutLoading: false,

    clearError: () => set({ error: null }),

    signUp: async (userName, email, password) => {
        set({ signUpLoading: true, error: null });
        try {
            await axiosInstance.post("/user/signUp", { userName, email, password });
            set({ signUpLoading: false });
        } catch (error: any) {
            set({
                signUpLoading: false,
                error: error.response?.data?.message || "Đăng ký thất bại",
            });
            throw error;
        }
    },

    signIn: async (email, password) => {
        set({ signInLoading: true, error: null });
        try {
            const res = await axiosInstance.post("/user/signIn", { email, password });
            const userData: User = res.data;

            localStorage.setItem("user", JSON.stringify(userData));
            localStorage.setItem("isAuthenticated", "true");

            set({ 
                user: userData, 
                isAuthenticated: true, 
                signInLoading: false,
                error: null 
            });
        } catch (error: any) {
            set({
                user: null,
                isAuthenticated: false,
                signInLoading: false,
                error: error.response?.data?.message || "Đăng nhập thất bại",
            });
            throw error;
        }
    },

    checkAuth: async () => {
        set({ loading: true });
        try {
            const res = await axiosInstance.get("/user/checkAuth");
            const userData: User = res.data;

            localStorage.setItem("user", JSON.stringify(userData));
            localStorage.setItem("isAuthenticated", "true");

            set({ 
                user: userData, 
                isAuthenticated: true,
                loading: false,
                error: null 
            });
        } catch (error: any) {
            localStorage.removeItem("user");
            localStorage.removeItem("isAuthenticated");
            set({ 
                user: null, 
                isAuthenticated: false, 
                loading: false,
                error: null 
            });
        }
    },

    logout: async () => {
        set({ logoutLoading: true, error: null });
        try {
            await axiosInstance.post("/user/logout");

            localStorage.removeItem("user");
            localStorage.removeItem("isAuthenticated");

            set({
                user: null,
                isAuthenticated: false,
                logoutLoading: false,
                error: null,
            });
        } catch (error: any) {
            set({
                user: null,
                isAuthenticated: false,
                logoutLoading: false,
                error: error.response?.data?.message || "Đăng xuất thất bại",
            });
            throw error;
        }
    }
}));
