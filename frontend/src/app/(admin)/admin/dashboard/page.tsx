import { getEstadisticasVentas, getGraficoVentas } from '@/features/admin/ventas-api'
import { getPedidosStats, getAllPedidos } from '@/features/orders/api'
import { getServiciosEstadisticas } from '@/features/services/api'
import { getAllRefacciones } from '@/features/catalog/api'
import OverviewSection from '@/features/admin/sections/OverviewSection'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
    const [estadisticasVentas, grafico, pedidosStats, pedidos, serviciosEstadisticas, refacciones] =
        await Promise.all([
            getEstadisticasVentas('mes').catch(() => null),
            getGraficoVentas('dia', new Date().getFullYear(), new Date().getMonth() + 1).catch(() => ({ datos: [], tipo: 'dia', año: new Date().getFullYear() })),
            getPedidosStats().catch(() => null),
            getAllPedidos(1).catch(() => ({ results: [], count: 0, next: null, previous: null })),
            getServiciosEstadisticas().catch(() => null),
            getAllRefacciones().catch(() => []),
        ])

    return (
        <OverviewSection
            estadisticasVentas={estadisticasVentas}
            grafico={grafico.datos ?? []}
            pedidosStats={pedidosStats}
            pedidos={pedidos.results ?? []}
            pedidosCount={pedidos.count ?? 0}
            serviciosEstadisticas={serviciosEstadisticas}
            refacciones={Array.isArray(refacciones) ? refacciones : []}
        />
    )
}
