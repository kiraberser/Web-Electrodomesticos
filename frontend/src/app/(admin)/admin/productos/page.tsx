import { getAllRefacciones } from "@/api/productos"
import RefaccionesClient from "./RefaccionesClient"

export const metadata = {
    title: "Refacciones | Gestión de Productos",
    description: "Administra el inventario de refacciones de electrodomésticos",
}

export default async function RefaccionesPage() {
    // Solo cargar refacciones en el servidor
    const refacciones = await getAllRefacciones()

    return <RefaccionesClient initialRefacciones={refacciones} />
}
