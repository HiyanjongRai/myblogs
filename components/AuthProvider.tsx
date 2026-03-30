"use client";

/**
 * AuthProvider — Wraps the app and hydrates auth state on mount.
 * Place in root layout to persist login across page navigations.
 */
import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const fetchUser = useAuthStore((s) => s.fetchUser);

  useEffect(() => {
    fetchUser(); // Attempt to restore session from cookie on load
  }, [fetchUser]);

  return <>{children}</>;
}
