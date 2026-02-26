"use client";

import '@/styles/index.css';
import React from "react";
import { usePathname, useRouter } from "next/navigation";
import Sidebar from "@/features/admin/layout/Sidebar";
import Topbar from "@/features/admin/layout/Topbar";
import { Toaster } from "@/features/admin/ui/Toaster";
import { useToasts } from "@/features/admin/hooks/useToasts";
import { AdminThemeProvider } from "@/features/admin/hooks/useAdminTheme";
import type { DateRange, SectionKey, NavItem } from "@/features/admin/utils/types";
import { LayoutDashboard, Package, ShoppingCart, Server, Book, Box, Store, MonitorSmartphone } from "lucide-react";

export default function RootLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const [dark, setDark] = React.useState(true);
    const [dateRange, setDateRange] = React.useState<DateRange>(() => {
      const to = new Date();
      const from = new Date();
      from.setDate(to.getDate() - 29);
      return { from: from.toISOString(), to: to.toISOString() };
    });
    const { toasts, push, remove } = useToasts();
    const [sidebarOpen, setSidebarOpen] = React.useState(false);

    // Cookie helpers
    const setCookie = (name: string, value: string, days: number) => {
      try {
        const d = new Date();
        d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
        document.cookie = `${name}=${value};expires=${d.toUTCString()};path=/`;
      } catch {}
    };
    const getCookie = (name: string): string | null => {
      try {
        const cname = name + "=";
        const decodedCookie = decodeURIComponent(document.cookie || "");
        const ca = decodedCookie.split(";");
        for (let i = 0; i < ca.length; i++) {
          let c = ca[i];
          while (c.charAt(0) === " ") c = c.substring(1);
          if (c.indexOf(cname) === 0) return c.substring(cname.length, c.length);
        }
      } catch {}
      return null;
    };

    // Initialize theme from cookie
    React.useEffect(() => {
      const saved = getCookie("admin-theme");
      if (saved === "light") setDark(false);
      if (saved === "dark") setDark(true);
    }, []);

    const handleToggleTheme = React.useCallback(() => {
      setDark((prev) => {
        const next = !prev;
        setCookie("admin-theme", next ? "dark" : "light", 365);
        return next;
      });
    }, []);

    const active: SectionKey = pathname?.includes("/productos")
      ? "productos"
      : pathname?.includes("/pedidos")
      ? "pedidos"
      : pathname?.includes("/ventas")
      ? "ventas"
      : pathname?.includes("/servicios")
      ? "servicios"
      : pathname?.includes("/blog")
      ? "blog"
      : pathname?.includes("/inventario")
      ? "inventario"
      : pathname?.includes("/pos")
      ? "pos"
      : "overview";

    const navItems: NavItem[] = [
      { key: "overview", label: "Dashboard", icon: LayoutDashboard },
      { key: "pedidos", label: "Pedidos", icon: ShoppingCart },
      { key: "productos", label: "Productos", icon: Package },
      { key: "ventas", label: "Ventas", icon: Store },
      { key: "servicios", label: "Servicios", icon: Server },
      { key: "blog", label: "Blog", icon: Book },
      { key: "inventario", label: "Inventario", icon: Box },
      { key: "pos", label: "POS", icon: MonitorSmartphone },
    ];

    const handleNavigate = (key: SectionKey) => {
      if (key === "overview") router.push("/admin/dashboard");
      if (key === "pedidos") router.push("/admin/pedidos");
      if (key === "productos") router.push("/admin/productos");
      if (key === "ventas") router.push("/admin/ventas");
      if (key === "servicios") router.push("/admin/servicios");
      if (key === "blog") router.push("/admin/blog/create");
      if (key === "inventario") router.push("/admin/inventario");
      if (key === "pos") router.push("/admin/pos");
    };

    return (
      <html lang="es">
        <body>
        <AdminThemeProvider value={{
          dark,
          setDark: (v: boolean) => {
            setDark(v);
            try {
              const d = new Date();
              d.setTime(d.getTime() + 365 * 24 * 60 * 60 * 1000);
              document.cookie = `admin-theme=${v ? "dark" : "light"};expires=${d.toUTCString()};path=/`;
            } catch {}
          },
          toggle: () => handleToggleTheme(),
        }}>
        <div className={`${dark ? "bg-slate-950" : "bg-slate-100"} min-h-screen font-sans antialiased ${dark ? "text-slate-200" : "text-slate-800"}`}>
          <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[16rem_1fr]">
            <Sidebar
              open={sidebarOpen}
              onCloseAction={() => setSidebarOpen(false)}
              active={active}
              items={navItems}
              onNavigateAction={(k) => handleNavigate(k)}
            />
            <div className="flex min-h-screen flex-col">
              <Topbar
                onOpenSidebarAction={() => setSidebarOpen(true)}
                dateRange={dateRange}
                setDateRangeAction={setDateRange}
                onQuickAction={(k: string) => {
                  if (k === "add-product") {
                    handleNavigate("productos");
                    push({ type: "info", title: "Abriendo editor de producto" });
                  }
                }}
              />
              <main className="mx-auto w-full flex-1 p-4 md:p-6 lg:p-8">{children}</main>
            </div>
          </div>
            <Toaster toasts={toasts} onRemove={remove} />
          </div>
        </AdminThemeProvider>
        </body>
      </html>
    );
}
