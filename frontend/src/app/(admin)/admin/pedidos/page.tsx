import { getAllPedidos } from "@/api/pedidos"
import PedidosClient from "./PedidosClient"

export const metadata = {
    title: "Pedidos | Administración",
    description: "Gestiona todos los pedidos del sistema",
}

export default async function PedidosPage() {
    // Cargar primera página de pedidos en el servidor
    const response = await getAllPedidos(1)

    return <PedidosClient 
        initialPedidos={response.results}
        initialTotalCount={response.count}
        initialTotalPages={Math.ceil(response.count / 20)}
    />
}

