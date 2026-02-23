import { getAllCategorias } from "@/features/catalog/api"
import CategoriasClient from "./CategoriasClient"

export const metadata = {
    title: "Categorías | Gestión de Productos",
    description: "Administra las categorías de electrodomésticos",
}

export default async function CategoriasPage() {
    const categorias = await getAllCategorias()

    return <CategoriasClient initialCategorias={categorias} />
}

