import { getAllServices } from "@/api/services"
import ServicesPageClient from "@/app/(admin)/admin/servicios/ServicesPageClient"

export const dynamic = 'force-dynamic'

type PageProps = { searchParams: Promise<{ page?: string; q?: string }> }

export default async function ServicesPage({ searchParams }: PageProps) {
    const sp = await searchParams
    const page = Number(sp.page ?? 1)
    const q = sp.q || undefined

    const response = await getAllServices(page, 10, q)

    return (
        <ServicesPageClient
            initialServices={response.data}
            initialPagination={response.pagination}
            initialQuery={q || ""}
        />
    )
}
