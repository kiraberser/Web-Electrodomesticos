"use client"

import { useEffect, useState, useCallback } from "react"
import { Plus, Search, Filter } from "lucide-react"
import { Button, Input } from "@/components/ui/forms"
import { Badge } from "@/components/ui/feedback/Badge"
import ServicesTable from "@/components/features/services/services-table"
import { DeleteServiceModal, AddServiceModal } from "@/components/features/services"
import { deleteServiceAction } from "@/actions/services"
import { useRouter, useSearchParams } from "next/navigation"
import type { AdminServicePageItem as Service, PaginationInfo } from "@/types/service"
import { useAdminTheme } from "@/components/admin/hooks/useAdminTheme"

export default function ServicesPageClient({
    initialServices,
    initialPagination,
    initialQuery,
}: {
    initialServices: Service[]
    initialPagination: PaginationInfo
    initialQuery: string
}) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const { dark } = useAdminTheme()

    const [services, setServices] = useState<Service[]>(initialServices)
    const [pagination, setPagination] = useState<PaginationInfo>(initialPagination)
    const [loading] = useState(false)
    const [searchQuery, setSearchQuery] = useState(initialQuery || "")
    const [selectedService, setSelectedService] = useState<Service | null>(null)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)

    useEffect(() => {
        setServices(initialServices)
        setPagination(initialPagination)
        setSearchQuery(initialQuery || "")
    }, [initialServices, initialPagination, initialQuery])

    const openDeleteModal = (service: Service) => {
        setSelectedService(service)
        setIsDeleteModalOpen(true)
    }

    const handleDeleteService = () => {
        if (selectedService) {
            deleteServiceAction(selectedService.noDeServicio.toString())
            setIsDeleteModalOpen(false)
            setSelectedService(null)
            router.refresh()
        }
        return
    }

    const handlePageChange = useCallback((page: number) => {
        const params = new URLSearchParams(searchParams?.toString())
        params.set("page", String(page))
        router.push(`?${params.toString()}`)
    }, [router, searchParams])

    // Client-side search over the already loaded services
    const normalizedQuery = searchQuery.trim().toLowerCase()
    const filteredServices = normalizedQuery
        ? services.filter((s) => {
            const inId = String(s.noDeServicio).includes(normalizedQuery)
            const inCliente = s.cliente?.toLowerCase().includes(normalizedQuery)
            const inAparato = s.aparato?.toLowerCase().includes(normalizedQuery)
            const inTelefono = s.telefono?.toLowerCase().includes(normalizedQuery)
            return inId || inCliente || inAparato || inTelefono
        })
        : services

    const handleSearchChange = (q: string) => {
        setSearchQuery(q)
    }

    const handleAddModalClose = useCallback(() => {
        setIsAddModalOpen(false)
        router.refresh()
    }, [router])

    return (
        <div className={`${dark ? "text-gray-200" : "text-gray-900"}`}>
            <div className={`${dark ? "border-b border-white/10 bg-transparent" : "bg-white border-b border-gray-200"}`}>
                <div className="container mx-auto px-4 py-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h1 className={`text-2xl font-bold ${dark ? "text-gray-100" : "text-gray-900"}`}>Gestión de Servicios</h1>
                            <p className={`${dark ? "text-gray-400" : "text-gray-600"} mt-1`}>Administra todos los servicios de reparación y mantenimiento</p>
                        </div>

                        <div className="flex items-center gap-3">
                            <Badge variant="secondary" className={`${dark ? "bg-blue-500/20 text-blue-300" : "bg-blue-100 text-blue-700"}`}>
                                {pagination.count} servicios
                            </Badge>
                            <Button
                                onClick={() => setIsAddModalOpen(true)}
                                className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Nuevo Servicio
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-6">
                <div className={`${dark ? "rounded-lg border border-white/10 bg-[#0F172A] shadow-sm shadow-black/20" : "bg-white rounded-lg shadow-sm border border-gray-200"} p-4 mb-6`}>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${dark ? "text-gray-300" : "text-gray-700"}`} />
                                <Input
                                    placeholder="Buscar por cliente, aparato, teléfono o número de servicio..."
                                    value={searchQuery}
                                    onChange={(e) => handleSearchChange(e.target.value)}
                                    className={`pl-10 focus:ring-blue-500 ${dark ? "border-white/10 bg-white/5 text-gray-100 placeholder-gray-400 focus:border-white/20" : "border-gray-300 text-gray-700 focus:border-blue-500"}`}
                                />
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <Button variant="outline" className={`cursor-pointer bg-transparent ${dark ? "text-gray-200" : "text-gray-800"}`}>
                                <Filter className="w-4 h-4 mr-2" />
                                Filtros
                            </Button>
                        </div>
                    </div>
                </div>

                <div className={`${dark ? "rounded-lg border border-white/10 bg-[#0F172A] shadow-sm shadow-black/20" : "bg-white rounded-lg shadow-sm border border-gray-200"}`}>
                    <ServicesTable
                        services={filteredServices}
                        loading={loading}
                        onDeleteServiceAction={openDeleteModal}
                        searchQuery={searchQuery}
                        pagination={normalizedQuery
                            ? {
                                count: filteredServices.length,
                                next: null,
                                previous: null,
                                currentPage: 1,
                                totalPages: 1,
                                pageSize: filteredServices.length,
                            }
                            : pagination}
                        onPageChangeAction={handlePageChange}
                    />
                </div>
            </div>

            <DeleteServiceModal
                isOpen={isDeleteModalOpen}
                onCloseAction={() => {
                    setIsDeleteModalOpen(false)
                    setSelectedService(null)
                }}
                onConfirmAction={handleDeleteService}
                service={selectedService || null}
            />

            <AddServiceModal 
                isOpen={isAddModalOpen} 
                onCloseAction={handleAddModalClose}
            />
        </div>
    )
}


