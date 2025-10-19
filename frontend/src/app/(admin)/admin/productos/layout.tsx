import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Gestión de Productos | Admin",
    description: "Administra marcas, categorías, proveedores y refacciones",
}

export default function ProductosLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}

