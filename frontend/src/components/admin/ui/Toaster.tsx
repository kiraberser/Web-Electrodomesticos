"use client";
import React from "react";
import { Toast } from "@/components/admin/ui";

export const Toaster: React.FC<{ toasts: Array<{ id: string; type?: "success" | "error" | "info"; title: string; description?: string }>; onRemove: (id: string) => void }>
  = ({ toasts, onRemove }) => (
  <div className="pointer-events-none fixed bottom-4 right-4 z-50 flex w-80 flex-col gap-2">
    {toasts.map((t) => (
      <div key={t.id} className="pointer-events-auto" role="status" aria-live="polite" onClick={() => onRemove(t.id)}>
        <Toast type={t.type} title={t.title} description={t.description} />
      </div>
    ))}
  </div>
);
