"use client"

import { useEffect, useState, useCallback, useTransition, useRef } from "react"
import { Plus, Search } from "lucide-react"
import { Button } from "@/shared/ui/forms/Button"
import { Badge } from "@/shared/ui/feedback/Badge"
import { Input } from "@/shared/ui/forms/InputField"
import Link from "next/link"
import ServicesTable from "@/features/services/services-table"
import { DeleteServiceModal } from "@/features/services/delete-service-modal"
import { AddServiceModal } from "@/features/services/add-service-modal"
import {
    deleteServiceAction,
    lookupServiceAction,
    updateServiceStatusAction,
    updateRevisionStatusAction,
} from "@/features/services/actions"
import { useRouter, useSearchParams } from "next/navigation"
import type { AdminServicePageItem as Service, PaginationInfo, ServiceDetail } from "@/shared/types/service"
import { useAdminTheme } from "@/features/admin/hooks/useAdminTheme"

function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString("es-MX", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    })
}

function formatPhone(phone: string) {
    if (phone.length === 10) {
        return `(${phone.slice(0, 3)}) ${phone.slice(3, 6)}-${phone.slice(6)}`
    }
    return phone
}

function Cell({ label, value, dark }: { label: string; value: string; dark: boolean }) {
    return (
        <div>
            <p className={`text-xs font-medium ${dark ? "text-gray-500" : "text-gray-400"}`}>{label}</p>
            <p className={`text-sm font-medium ${dark ? "text-gray-200" : "text-gray-800"}`}>{value}</p>
        </div>
    )
}

export default function ServicesPageClient({
    initialServices,
    initialPagination,
}: {
    initialServices: Service[]
    initialPagination: PaginationInfo
}) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const { dark } = useAdminTheme()

    const [services, setServices] = useState<Service[]>(initialServices)
    // Always-fresh ref so callbacks can read current state without stale closures
    const servicesRef = useRef<Service[]>(initialServices)
    servicesRef.current = services
    const [pagination, setPagination] = useState<PaginationInfo>(initialPagination)
    const [loading] = useState(false)
    const [estadoFilter, setEstadoFilter] = useState<string | null>(null)
    const [aparatoFilter, setAparatoFilter] = useState<string | null>(null)
    const [lookupId, setLookupId] = useState("")
    const [lookedUpService, setLookedUpService] = useState<ServiceDetail | null>(null)
    const [lookupError, setLookupError] = useState("")
    const [isPending, startTransition] = useTransition()
    const [selectedService, setSelectedService] = useState<Service | null>(null)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)

    useEffect(() => {
        setServices(initialServices)
        setPagination(initialPagination)
    }, [initialServices, initialPagination])

    const handleLookup = () => {
        if (!lookupId.trim()) return
        setLookupError("")
        setLookedUpService(null)
        startTransition(async () => {
            const result = await lookupServiceAction(lookupId.trim())
            if (result.success) {
                setLookedUpService(result.data as ServiceDetail)
            } else {
                setLookedUpService(null)
                setLookupError(result.error as string)
            }
        })
    }

    const clearLookup = () => {
        setLookedUpService(null)
        setLookupError("")
        setLookupId("")
    }

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
    }

    const handlePageChange = useCallback((page: number) => {
        const params = new URLSearchParams(searchParams?.toString())
        params.set("page", String(page))
        router.push(`?${params.toString()}`)
    }, [router, searchParams])

    const handleAddModalClose = useCallback(() => {
        setIsAddModalOpen(false)
        router.refresh()
    }, [router])

    const handleStatusChange = useCallback((id: number, newEstado: string) => {
        // Capture previous value before optimistic update for rollback
        const prevEstado = servicesRef.current.find(s => s.noDeServicio === id)?.estado
        setServices(prev =>
            prev.map(s => s.noDeServicio === id ? { ...s, estado: newEstado as Service["estado"] } : s)
        )
        updateServiceStatusAction(String(id), newEstado).then(result => {
            if (!result.success && prevEstado !== undefined) {
                // Roll back the optimistic update
                setServices(prev =>
                    prev.map(s => s.noDeServicio === id ? { ...s, estado: prevEstado as Service["estado"] } : s)
                )
            }
        })
    }, [])

    const handleRevisionChange = useCallback((id: number, newRevision: string) => {
        const prevRevision = servicesRef.current.find(s => s.noDeServicio === id)?.estadoPago
        setServices(prev =>
            prev.map(s => s.noDeServicio === id ? { ...s, estadoPago: newRevision as Service["estadoPago"] } : s)
        )
        updateRevisionStatusAction(String(id), newRevision).then(result => {
            if (!result.success && prevRevision !== undefined) {
                setServices(prev =>
                    prev.map(s => s.noDeServicio === id ? { ...s, estadoPago: prevRevision as Service["estadoPago"] } : s)
                )
            }
        })
    }, [])

    // Client-side filtering
    const filteredServices = services.filter(s => {
        if (estadoFilter && s.estado !== estadoFilter) return false
        if (aparatoFilter && s.aparato !== aparatoFilter) return false
        return true
    })

    // Unique aparatos for dropdown
    const aparatos = Array.from(new Set(services.map(s => s.aparato).filter(Boolean))).sort()

    const isFiltered = estadoFilter !== null || aparatoFilter !== null

    const chipClass = (active: boolean) =>
        `px-3 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer ${active
            ? dark
                ? "bg-blue-500/30 text-blue-300 border border-blue-500/50"
                : "bg-blue-100 text-blue-700 border border-blue-300"
            : dark
                ? "bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10"
                : "bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200"
        }`

    return (
        <div className={`${dark ? "text-gray-200" : "text-gray-900"}`}>
            {/* Header */}
            <div className={`${dark ? "border-b border-white/10 bg-transparent" : "bg-white border-b border-gray-200"}`}>
                <div className="container mx-auto px-4 py-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h1 className={`text-2xl font-bold ${dark ? "text-gray-100" : "text-gray-900"}`}>
                                Gestión de Servicios
                            </h1>
                            <p className={`${dark ? "text-gray-400" : "text-gray-600"} mt-1`}>
                                Administra todos los servicios de reparación y mantenimiento
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Badge
                                variant="secondary"
                                className={`${dark ? "bg-blue-500/20 text-blue-300" : "bg-blue-100 text-blue-700"}`}
                            >
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

            <div className="container mx-auto px-4 py-6 space-y-4">
                {/* Lookup by ID */}
                <div className={`${dark ? "rounded-lg border border-white/10 bg-[#0F172A] shadow-sm shadow-black/20" : "bg-white rounded-lg shadow-sm border border-gray-200"} p-4`}>
                    <p className={`text-xs font-medium mb-2 ${dark ? "text-gray-400" : "text-gray-500"}`}>
                        Buscar servicio por número
                    </p>
                    <div className="flex flex-wrap gap-2 items-center">
                        <div className="relative">
                            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${dark ? "text-gray-400" : "text-gray-400"}`} />
                            <Input
                                type="number"
                                placeholder="Ej. 123"
                                value={lookupId}
                                onChange={e => {
                                    setLookupId(e.target.value)
                                    setLookupError("")
                                    setLookedUpService(null)
                                }}
                                onKeyDown={e => e.key === "Enter" && handleLookup()}
                                className={`pl-9 w-36 ${dark ? "border-white/10 bg-white/5 text-gray-100 placeholder-gray-500" : "border-gray-300 text-gray-700"}`}
                            />
                        </div>
                        <Button
                            onClick={handleLookup}
                            disabled={isPending || !lookupId.trim()}
                            className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer disabled:opacity-50"
                        >
                            {isPending ? "Buscando..." : "Buscar"}
                        </Button>
                        {(lookedUpService || lookupError) && (
                            <button
                                onClick={clearLookup}
                                className={`text-xs underline ${dark ? "text-gray-400 hover:text-gray-200" : "text-gray-500 hover:text-gray-700"}`}
                            >
                                Limpiar
                            </button>
                        )}
                    </div>

                    {lookupError && (
                        <p className={`mt-2 text-sm ${dark ? "text-red-400" : "text-red-600"}`}>{lookupError}</p>
                    )}

                    {lookedUpService && (
                        <div className={`rounded-xl border p-4 mt-3 ${dark ? "border-blue-500/30 bg-blue-500/5" : "border-blue-200 bg-blue-50"}`}>
                            <p className={`text-xs font-semibold mb-3 ${dark ? "text-blue-400" : "text-blue-600"}`}>
                                Resultado — #{lookedUpService.noDeServicio}
                            </p>
                            <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                                <Cell dark={dark} label="No. Servicio" value={`#${lookedUpService.noDeServicio}`} />
                                <Cell dark={dark} label="Fecha"        value={formatDate(lookedUpService.fecha)} />
                                <Cell dark={dark} label="Cliente"      value={lookedUpService.cliente} />
                                <Cell dark={dark} label="Aparato"      value={lookedUpService.aparato} />
                                <Cell dark={dark} label="Teléfono"     value={formatPhone(lookedUpService.telefono)} />
                                <Cell dark={dark} label="Estado"       value={lookedUpService.estado} />
                            </div>
                            <Link
                                href={`/admin/servicios/${lookedUpService.noDeServicio}`}
                                className={`inline-block mt-3 text-xs font-medium ${dark ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-700"}`}
                            >
                                Ver detalle completo →
                            </Link>
                        </div>
                    )}
                </div>

                {/* Filters */}
                <div className={`${dark ? "rounded-lg border border-white/10 bg-[#0F172A] shadow-sm shadow-black/20" : "bg-white rounded-lg shadow-sm border border-gray-200"} p-4`}>
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                        <div className="flex flex-wrap gap-2 items-center flex-1">
                            <span className={`text-xs font-medium shrink-0 ${dark ? "text-gray-400" : "text-gray-500"}`}>
                                Estado:
                            </span>
                            {["Todos", "Pendiente", "En Proceso", "Reparado", "Entregado", "Cancelado"].map(e => (
                                <button
                                    key={e}
                                    onClick={() => setEstadoFilter(e === "Todos" ? null : e)}
                                    className={chipClass(e === "Todos" ? estadoFilter === null : estadoFilter === e)}
                                >
                                    {e}
                                </button>
                            ))}
                        </div>

                        {aparatos.length > 0 && (
                            <div className="flex items-center gap-2 shrink-0">
                                <span className={`text-xs font-medium ${dark ? "text-gray-400" : "text-gray-500"}`}>
                                    Aparato:
                                </span>
                                <select
                                    value={aparatoFilter ?? ""}
                                    onChange={e => setAparatoFilter(e.target.value || null)}
                                    className={`rounded-md px-2 py-1 text-xs border ${dark ? "bg-white/5 border-white/10 text-gray-200" : "bg-white border-gray-300 text-gray-700"}`}
                                >
                                    <option value="">Todos</option>
                                    {aparatos.map(a => <option key={a} value={a}>{a}</option>)}
                                </select>
                            </div>
                        )}
                    </div>
                </div>

                {/* Table */}
                <div className={`${dark ? "rounded-lg border border-white/10 bg-[#0F172A] shadow-sm shadow-black/20" : "bg-white rounded-lg shadow-sm border border-gray-200"}`}>
                    <ServicesTable
                        services={filteredServices}
                        loading={loading}
                        onDeleteServiceAction={openDeleteModal}
                        pagination={isFiltered
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
                        onStatusChangeAction={handleStatusChange}
                        onRevisionChangeAction={handleRevisionChange}
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
