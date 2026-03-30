"use client";

/**
 * Global Auth Context using Zustand
 * Provides user state and auth actions across the app
 */
import { create } from "zustand";
import axios from "axios";

interface User {
  username: string;
  fullName: string;
  email: string;
  profileImage?: string;
  createdAt?: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  fetchUser: () => Promise<void>;
  login: (identifier: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

interface RegisterData {
  username: string;
  fullName: string;
  email: string;
  password: string;
  profileImage?: string;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,
  error: null,

  clearError: () => set({ error: null }),

  fetchUser: async () => {
    set({ loading: true, error: null });
    const timeout = setTimeout(() => {
      set({ loading: false });
    }, 5000); // 5s session check limit

    try {
      const { data } = await axios.get("/api/auth/me");
      set({ user: data.user, loading: false });
      clearTimeout(timeout);
    } catch {
      set({ user: null, loading: false });
      clearTimeout(timeout);
    }
  },

  login: async (identifier: string, password: string) => {
    set({ loading: true, error: null });
    try {
      const { data } = await axios.post("/api/auth/login", { identifier, password });
      set({ user: data.user, loading: false, error: null });
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      set({
        error: error?.response?.data?.error || "Login failed",
        loading: false,
      });
      throw err;
    }
  },

  register: async (formData: RegisterData) => {
    set({ loading: true, error: null });
    try {
      const { data } = await axios.post("/api/auth/register", formData);
      set({ user: data.user, loading: false, error: null });
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      set({
        error: error?.response?.data?.error || "Registration failed",
        loading: false,
      });
      throw err;
    }
  },

  logout: async () => {
    set({ loading: true });
    try {
      await axios.post("/api/auth/logout");
    } finally {
      set({ user: null, loading: false, error: null });
    }
  },
}));
