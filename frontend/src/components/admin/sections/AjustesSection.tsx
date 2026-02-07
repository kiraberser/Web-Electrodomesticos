"use client";
import React, { useState } from "react";
import { Card } from "@/components/admin/ui/Card";
import { Button } from "@/components/admin/ui/Button";
import { Input } from "@/components/admin/ui/Input";
import { useAdminTheme } from "@/components/admin/hooks/useAdminTheme";


import { PRIMARY, SECONDARY } from "@/components/admin/utils/format";

export const AjustesSection: React.FC<{ onToastAction: (t: { type?: "success" | "error" | "info"; title: string; description?: string }) => void; onToggleThemeAction: () => void; dark: boolean }>
  = ({ onToastAction, onToggleThemeAction, dark }) => {
  const { dark: ctxDark } = useAdminTheme();
  const [brevoKey, setBrevoKey] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const [enviosHabilitado, setEnviosHabilitado] = useState(true);
  const [iva, setIva] = useState(16);
  const [notificaciones, setNotificaciones] = useState({ pedidos: true, productos: false, marketing: true });
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <Card title="Branding" description="Logo y colores">
          <div className="space-y-3">
            <div>
              <p className={`text-xs ${ctxDark ? "text-gray-400" : "text-gray-600"}`}>Logo</p>
              <div className="mt-2 flex items-center gap-3">
                <div className={`h-10 w-10 rounded-lg ${ctxDark ? "bg-white/10" : "bg-black/5"}`} />
                <Button variant="outline">Subir</Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input label="Primario" defaultValue={PRIMARY} />
              <Input label="Secundario" defaultValue={SECONDARY} />
            </div>
          </div>
        </Card>
        <Card title="Integraciones" description="Brevo (Email)">
          <div className="space-y-3">
            <Input label="API Key" value={brevoKey} onChange={(e) => setBrevoKey(e.target.value)} placeholder="brevo_xxx" />
            <Input label="Remitente a verificar" value={senderEmail} onChange={(e) => setSenderEmail(e.target.value)} placeholder="ventas@tudominio.com" />
            <div className="flex gap-2">
              <Button onClick={() => onToastAction({ type: "success", title: "API Key guardada" })}>Guardar</Button>
              <Button variant="outline" onClick={() => onToastAction({ type: "info", title: "Verificación enviada", description: senderEmail || "correo" })}>Probar remitente</Button>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <Card title="Envíos">
          <div className="flex items-center justify-between">
            <span className="text-sm">Habilitar envíos</span>
            <button onClick={() => setEnviosHabilitado((v) => !v)} className={`relative h-6 w-11 rounded-full ${enviosHabilitado ? "bg-emerald-500" : "bg-white/10"}`} aria-pressed={enviosHabilitado}>
              <span className={`absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition-all ${enviosHabilitado ? "translate-x-5" : ""}`} />
            </button>
          </div>
        </Card>
        <Card title="Impuestos">
          <div className="grid grid-cols-2 gap-2">
            <Input label="IVA %" type="number" value={String(iva)} onChange={(e) => setIva(Number(e.target.value))} />
            <Input label="Zona" defaultValue="MX" />
          </div>
        </Card>
        <Card title="Notificaciones">
          <div className="space-y-2 text-sm">
            {Object.entries(notificaciones).map(([k, v]) => (
              <label key={k} className="flex items-center justify-between">
                <span className="capitalize">{k}</span>
                <input type="checkbox" checked={v} onChange={() => setNotificaciones((prev) => ({ ...prev, [k]: !prev[k as keyof typeof prev] }))} className="h-4 w-4" />
              </label>
            ))}
          </div>
        </Card>
      </div>

      <Card title="Preferencias" description="Tema y accesibilidad">
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" onClick={onToggleThemeAction}>Cambiar a modo {dark ? "claro" : "oscuro"}</Button>
          <Button variant="outline">Probar newsletter</Button>
        </div>
      </Card>
    </div>
  );
};
