"use client";

import '@/styles/index.css';
import { Inter } from 'next/font/google'
import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { Sidebar, Topbar } from "@/components/admin/layout";
import { Toaster } from "@/components/admin/ui";
import { useToasts } from "@/components/admin/hooks";
import { AdminThemeProvider } from "@/components/admin/hooks/useAdminTheme";
import type { DateRange, SectionKey, NavItem } from "@/components/admin/utils";
import { LayoutDashboard, Package, ShoppingCart, Settings, Server, Book, Box  } from "lucide-react";

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

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
      : pathname?.includes("/ajustes")
      ? "ajustes"
      : pathname?.includes("/servicios")
      ? "servicios"
      : pathname?.includes("/blog")
      ? "blog"
      : pathname?.includes("/inventario")
      ? "inventario"
      : pathname?.includes("/dashboard")
      ? "dashboard"
      : "overview";

    const navItems: NavItem[] = [
      { key: "overview", label: "Overview", icon: LayoutDashboard },
      { key: "pedidos", label: "Pedidos", icon: ShoppingCart },
      { key: "productos", label: "Productos", icon: Package },
      { key: "ajustes", label: "Ajustes", icon: Settings },
      { key: "servicios", label: "Servicios", icon: Server },
      { key: "blog", label: "Blog", icon: Book },
      { key: "inventario", label: "Inventario", icon: Box},
      { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },

    ];

    const handleNavigate = (key: SectionKey) => {
      if (key === "overview") router.push("/admin/dashboard");
      if (key === "pedidos") router.push("/admin/pedidos");
      if (key === "productos") router.push("/admin/productos");
      if (key === "ajustes") router.push("/admin/ajustes");
      if (key === "servicios") router.push("/admin/servicios");
      if (key === "blog") router.push("/admin/blog/create");
      if (key === "inventario") router.push("/admin/inventario");
      if (key === "dashboard") router.push("/admin/dashboard");
    };

    return (
      <html lang="en">
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
        <div className={`${dark ? "bg-[#0B1220]" : ""} min-h-screen  font-sans text-gray-200`}>
          <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[18rem_1fr]">
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
              <main className={`mx-auto w-full  flex-1 space-y-3 p-3 md:p-4 lg:p-6 xl:p-8 ${dark ? "" : ""}`}>{children}</main>
            </div>
          </div>
            <Toaster toasts={toasts} onRemove={remove} />
          </div>
        </AdminThemeProvider>
        </body>
      </html>
    );
}