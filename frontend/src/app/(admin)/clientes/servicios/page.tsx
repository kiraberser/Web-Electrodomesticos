"use client"

import { useState, useEffect } from "react"
import { Plus, Search, Filter } from "lucide-react"
import { Button } from "@/components/ui/forms/Button"
import { Input } from "@/components/ui/forms/InputField"
import { Badge } from "@/components/ui"

import ServicesTable from "@/components/features/services/services-table"
import DeleteServiceModal from "@/components/features/services/delete-service-modal"
import AddServiceModal from "@/components/features/services/add-service-modal"

interface Service {
    noDeServicio: number
    fecha: string
    aparato: string
    telefono: string
    cliente: string
    observaciones: string
    estado: "Pendiente" | "En Proceso" | "Reparado" | "Entregado" | "Cancelado"
    marca: number
}

interface ServicesResponse {
    count: number
    next: string | null
    previous: string | null
    results: Service[]
}

export default function ServicesPage() {
    const [services, setServices] = useState<Service[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedService, setSelectedService] = useState<Service | null>(null)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [totalCount, setTotalCount] = useState(0)

    // Mock data - replace with actual API call
    const mockData: ServicesResponse = {
        count: 2,
        next: null,
        previous: null,
        results: [
            {
                noDeServicio: 5,
                fecha: "2025-07-01",
                aparato: "Licuadora",
                telefono: "2321479161",
                cliente: "Edwin",
                observaciones: "asasa",
                estado: "Reparado",
                marca: 1,
            },
            {
                noDeServicio: 4,
                fecha: "2025-07-01",
                aparato: "Bomba de Agua",
                telefono: "2323216694",
                cliente: "Diego",
                observaciones: "bien",
                estado: "Entregado",
                marca: 2,
            },
        ],
    }

    // Load services data
    useEffect(() => {
        const loadServices = async () => {
            try {
                setLoading(true)
                // Replace with actual API call
                // const response = await fetch('/api/services')
                // const data = await response.json()

                // Simulate API delay
                await new Promise((resolve) => setTimeout(resolve, 1000))

                setServices(mockData.results)
                setTotalCount(mockData.count)
            } catch (error) {
                console.error("Error loading services:", error)
            } finally {
                setLoading(false)
            }
        }

        loadServices()
    }, [])

    // Filter services based on search query
    const filteredServices = services.filter(
        (service) =>
            service.cliente.toLowerCase().includes(searchQuery.toLowerCase()) ||
            service.aparato.toLowerCase().includes(searchQuery.toLowerCase()) ||
            service.telefono.includes(searchQuery) ||
            service.noDeServicio.toString().includes(searchQuery),
    )

    // Handle delete service
    const handleDeleteService = async (serviceId: number) => {
        try {
            // Replace with actual API call
            // await fetch(`/api/services/${serviceId}`, { method: 'DELETE' })

            setServices(services.filter((service) => service.noDeServicio !== serviceId))
            setTotalCount((prev) => prev - 1)
            setIsDeleteModalOpen(false)
            setSelectedService(null)
        } catch (error) {
            console.error("Error deleting service:", error)
        }
    }

    // Handle add service
    const handleAddService = async (newService: Omit<Service, "noDeServicio">) => {
        try {
            // Replace with actual API call
            // const response = await fetch('/api/services', {
            //   method: 'POST',
            //   headers: { 'Content-Type': 'application/json' },
            //   body: JSON.stringify(newService)
            // })
            // const createdService = await response.json()

            const createdService: Service = {
                ...newService,
                noDeServicio: Math.max(...services.map((s) => s.noDeServicio)) + 1,
            }

            setServices([createdService, ...services])
            setTotalCount((prev) => prev + 1)
            setIsAddModalOpen(false)
        } catch (error) {
            console.error("Error adding service:", error)
        }
    }

    const openDeleteModal = (service: Service) => {
        setSelectedService(service)
        setIsDeleteModalOpen(true)
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header Section */}
            <div className="bg-white border-b border-gray-200">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Gestión de Servicios</h1>
                            <p className="text-gray-600 mt-1">Administra todos los servicios de reparación y mantenimiento</p>
                        </div>

                        <div className="flex items-center gap-3">
                            <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                                {totalCount} servicios
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

            {/* Main Content */}
            <div className="container mx-auto px-4 py-6">
                {/* Filters and Search */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <Input
                                    placeholder="Buscar por cliente, aparato, teléfono o número de servicio..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <Button variant="outline" className="cursor-pointer bg-transparent">
                                <Filter className="w-4 h-4 mr-2" />
                                Filtros
                            </Button>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-100">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">
                                {services.filter((s) => s.estado === "Pendiente").length}
                            </div>
                            <div className="text-xs text-gray-500">Pendientes</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-orange-600">
                                {services.filter((s) => s.estado === "En Proceso").length}
                            </div>
                            <div className="text-xs text-gray-500">En Proceso</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">
                                {services.filter((s) => s.estado === "Reparado").length}
                            </div>
                            <div className="text-xs text-gray-500">Reparados</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-purple-600">
                                {services.filter((s) => s.estado === "Entregado").length}
                            </div>
                            <div className="text-xs text-gray-500">Entregados</div>
                        </div>
                    </div>
                </div>

                {/* Services Table */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <ServicesTable
                        services={filteredServices}
                        loading={loading}
                        onDeleteService={openDeleteModal}
                        searchQuery={searchQuery}
                    />
                </div>
            </div>

            {/* Modals */}
            <DeleteServiceModal
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false)
                    setSelectedService(null)
                }}
                onConfirm={() => selectedService && handleDeleteService(selectedService.noDeServicio)}
                service={selectedService}
            />

            <AddServiceModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onSubmit={handleAddService} />
        </div>
    )
}
