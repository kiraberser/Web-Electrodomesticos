"use client";
import { useCallback, useState } from "react";

export type ToastItem = { id: string; type?: "success" | "error" | "info"; title: string; description?: string };

export function useToasts() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const push = useCallback((t: Omit<ToastItem, "id">) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, ...t }]);
    setTimeout(() => setToasts((prev) => prev.filter((x) => x.id !== id)), 4000);
  }, []);
  const remove = useCallback((id: string) => setToasts((prev) => prev.filter((x) => x.id !== id)), []);
  return { toasts, push, remove };
}
