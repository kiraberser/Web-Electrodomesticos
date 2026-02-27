import { getAllPedidos, getPedidosStats } from "@/features/orders/api"
import PedidosClient from "./PedidosClient"

export const dynamic = 'force-dynamic'

export const metadata = {
    title: "Pedidos | Administración",
    description: "Gestiona todos los pedidos del sistema",
}

export default async function PedidosPage() {
    const [response, stats] = await Promise.all([
        getAllPedidos(1),
        getPedidosStats(),
    ])

    return <PedidosClient
        initialPedidos={response.results}
        initialTotalCount={response.count}
        initialTotalPages={Math.ceil(response.count / 20)}
        initialStats={stats}
    />
}

