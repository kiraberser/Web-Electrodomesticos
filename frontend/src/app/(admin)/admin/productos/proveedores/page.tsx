import { getAllProveedores } from "@/features/catalog/api"
import ProveedoresClient from "./ProveedoresClient"

export const metadata = {
    title: "Proveedores | Gestión de Productos",
    description: "Administra los proveedores de refacciones",
}

export default async function ProveedoresPage() {
    const proveedores = await getAllProveedores()

    return <ProveedoresClient initialProveedores={proveedores} />
}

