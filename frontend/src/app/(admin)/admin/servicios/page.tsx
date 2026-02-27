import { getAllServices, getServiciosEstadisticas } from "@/features/services/api"
import ServicesPageClient from "@/app/(admin)/admin/servicios/ServicesPageClient"

export const dynamic = 'force-dynamic'

type PageProps = { searchParams: Promise<{ page?: string }> }

export default async function ServicesPage({ searchParams }: PageProps) {
    const sp = await searchParams
    const page = Number(sp.page ?? 1)

    const [response, estadisticas] = await Promise.all([
        getAllServices(page, 10),
        getServiciosEstadisticas(),
    ])

    return (
        <ServicesPageClient
            initialServices={response.data}
            initialPagination={response.pagination}
            estadisticas={estadisticas}
        />
    )
}
