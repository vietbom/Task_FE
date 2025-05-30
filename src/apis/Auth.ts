import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
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

export const useAuthStore = create(
  persist<AuthState>(
    (set) => ({
      user: null,
      isAuthenticated: false,
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
          const errorMessage =
            error.response?.data?.message ||
            error.message ||
            "Đăng ký thất bại. Vui lòng thử lại!";
          set({
            signUpLoading: false,
            error: errorMessage,
          });
          throw new Error(errorMessage);
        }
      },

      signIn: async (email, password) => {
        set({ signInLoading: true, error: null });
        try {
          const res = await axiosInstance.post("/user/signIn", { email, password });
          const userData: User = res.data;

          if (!userData?.id) {
            throw new Error("Dữ liệu người dùng không hợp lệ");
          }

          set({
            user: userData,
            isAuthenticated: true,
            signInLoading: false,
            error: null,
          });
        } catch (error: any) {
          const errorMessage =
            error.response?.data?.message ||
            error.message ||
            "Đăng nhập thất bại. Vui lòng thử lại!";
          set({
            user: null,
            isAuthenticated: false,
            signInLoading: false,
            error: errorMessage,
          });
          throw new Error(errorMessage);
        }
      },

      checkAuth: async () => {
        set({ loading: true, error: null });
        try {
          const res = await axiosInstance.get("/user/checkAuth");
          const userData: User = res.data;

          if (!userData?.id) {
            throw new Error("Dữ liệu người dùng không hợp lệ");
          }

          set({
            user: userData,
            isAuthenticated: true,
            loading: false,
            error: null,
          });
        } catch (error: any) {
          set({
            user: null,
            isAuthenticated: false,
            loading: false,
            error: null,
          });
        }
      },

      logout: async () => {
        set({ logoutLoading: true, error: null });
        try {
          await axiosInstance.post("/user/logout");
          set({
            user: null,
            isAuthenticated: false,
            logoutLoading: false,
            error: null,
          });
        } catch (error: any) {
          const errorMessage =
            error.response?.data?.message ||
            error.message ||
            "Đăng xuất thất bại. Vui lòng thử lại!";
          set({
            logoutLoading: false,
            error: errorMessage,
          });
          throw new Error(errorMessage);
        }
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage), 
    }
  )
);