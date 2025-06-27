import { create } from "zustand";
import { persist } from "zustand/middleware";
import apiClient from "@/services/client";

export interface UserState {
  user: {
    id: string;
    email: string;
    name: string;
    lastName: string;
  };
  roles: Array<{
    id: string;
    name: string;
  }>;
  isAdmin: boolean;
  isUser: boolean;
}

interface AuthState {
  token: string | null;
  user: UserState | undefined;
  setToken: (token: string | null) => void;
  setUser: (user: UserState | undefined) => void;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  fetchUser: () => Promise<boolean>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: undefined,
      setToken: (token: string | null) => {
        set({ token });
        apiClient.setToken(token || "");
      },
      setUser: (user: UserState | undefined) => set({ user }),
      login: async (email: string, password: string) => {
        try {
          const response = await apiClient
            .getInstance()
            .post("/login", { email, password });
          const receivedToken = response.data.token;
          get().setToken(receivedToken);
          await get().fetchUser();
          return true;
        } catch {
          return false;
        }
      },
      logout: async () => {
        set({ token: null, user: undefined });
        apiClient.setToken("");
      },
      fetchUser: async () => {
        try {
          const response = await apiClient.getInstance().get("/me");
          set({ user: response.data });
          return true;
        } catch {
          get().logout();
          return false;
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state: AuthState) => ({
        token: state.token,
        user: state.user,
      }),
    }
  )
);
