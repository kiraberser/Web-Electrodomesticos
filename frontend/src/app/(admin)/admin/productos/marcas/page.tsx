import { getAllMarcas } from "@/features/catalog/api"
import MarcasClient from "./MarcasClient"

export const metadata = {
    title: "Marcas | Gestión de Productos",
    description: "Administra las marcas de electrodomésticos",
}

export default async function MarcasPage() {
    const marcas = await getAllMarcas()

    return <MarcasClient initialMarcas={marcas} />
}

