import { getMovimientos } from "@/api/inventario"
import { getAllRefacciones, getAllCategorias } from "@/api/productos"
import InventarioClient from "./InventarioClient"

export const metadata = {
    title: "Inventario | Panel de Administracion",
    description: "Gestiona movimientos de inventario, entradas, salidas y devoluciones",
}

export default async function InventarioPage() {
    const [movimientosData, refacciones, categorias] = await Promise.all([
        getMovimientos(),
        getAllRefacciones(),
        getAllCategorias(),
    ])

    return (
        <InventarioClient
            initialMovimientos={movimientosData.results}
            initialCount={movimientosData.count}
            refacciones={refacciones}
            categorias={categorias}
        />
    )
}
