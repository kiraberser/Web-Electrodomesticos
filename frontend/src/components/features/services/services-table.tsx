"use client"

import { useState } from "react"
import { Edit, Trash2, Eye, Phone, Calendar, Package, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/forms/Button"
import { Badge } from "@/components/ui"
import Link from "next/link"
import Pagination from "@/components/ui/navigation/Pagination"
import type { AdminServicePageItem as Service, PaginationInfo } from "@/types/service"


interface ServicesTableProps {
    services: Service[]
    loading: boolean
    onDeleteServiceAction: (service: Service) => void
    searchQuery: string
    pagination: PaginationInfo
    onPageChangeAction: (page: number) => void
}

export default function ServicesTable({ services, loading, onDeleteServiceAction, searchQuery, pagination, onPageChangeAction }: ServicesTableProps) {
    const [sortField, setSortField] = useState<keyof Service>("noDeServicio")
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
    const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set())

    // Sort services (client-side sorting for now, could be moved to server)
    const sortedServices = [...services].sort((a, b) => {
        const aValue = a[sortField]
        const bValue = b[sortField]

        if (sortDirection === "asc") {
            return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
        } else {
            return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
        }
    })

    // Use server-side pagination data
    const { count, currentPage, totalPages, pageSize } = pagination

    const handleSort = (field: keyof Service) => {
        if (sortField === field) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc")
        } else {
            setSortField(field)
            setSortDirection("asc")
        }
        // Reset to first page when sorting changes
        onPageChangeAction(1)
    }

    const toggleRowExpansion = (serviceId: number) => {
        const newExpanded = new Set(expandedRows)
        if (newExpanded.has(serviceId)) {
            newExpanded.delete(serviceId)
        } else {
            newExpanded.add(serviceId)
        }
        setExpandedRows(newExpanded)
    }

    const handlePageChange = (page: number) => {
        onPageChangeAction(page)
    }

    const getStatusBadge = (status: Service["estado"]) => {
        const statusConfig = {
            Pendiente: { color: "bg-yellow-100 text-yellow-800", icon: "⏳" },
            "En Proceso": { color: "bg-blue-100 text-blue-800", icon: "🔧" },
            Reparado: { color: "bg-green-100 text-green-800", icon: "✅" },
            Entregado: { color: "bg-purple-100 text-purple-800", icon: "📦" },
            Cancelado: { color: "bg-red-100 text-red-800", icon: "❌" },
        }

        const config = statusConfig[status]
        return (
            <Badge className={`${config.color} font-medium`}>
                <span className="mr-1">{config.icon}</span>
                {status}
            </Badge>
        )
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        })
    }

    const formatPhone = (phone: string) => {
        // Format phone number: 2321479161 -> (232) 147-9161
        if (phone.length === 10) {
            return `(${phone.slice(0, 3)}) ${phone.slice(3, 6)}-${phone.slice(6)}`
        }
        return phone
    }

    const highlightText = (text: string, query: string) => {
        if (!query) return text

        const regex = new RegExp(`(${query})`, "gi")
        const parts = text.split(regex)

        return parts.map((part, index) =>
            regex.test(part) ? (
                <mark key={index} className="bg-yellow-200 px-1 rounded">
                    {part}
                </mark>
            ) : (
                part
            ),
        )
    }

    if (loading) {
        return (
            <div className="p-8">
                <div className="animate-pulse space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="space-y-3">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="h-12 bg-gray-200 rounded"></div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    if (services.length === 0) {
        return (
            <div className="p-8 text-center">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No hay servicios</h3>
                <p className="text-gray-500">
                    {searchQuery
                        ? "No se encontraron servicios que coincidan con tu búsqueda."
                        : "Aún no tienes servicios registrados."}
                </p>
            </div>
        )
    }

    // Pagination component
    const hrefForPage = (p: number) => {
        const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '')
        params.set('page', String(p))
        return `?${params.toString()}`
    }

    const TablePagination = () => (
        <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            count={count}
            pageSize={pageSize}
            onPageChange={handlePageChange}
            hrefForPage={hrefForPage}
        />
    )

    return (
        <div className="overflow-hidden">
            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-4 text-left">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleSort("noDeServicio")}
                                    className="font-medium text-gray-700 hover:text-gray-900 cursor-pointer"
                                >
                                    No. Servicio
                                    {sortField === "noDeServicio" &&
                                        (sortDirection === "asc" ? (
                                            <ChevronUp className="w-4 h-4 ml-1" />
                                        ) : (
                                            <ChevronDown className="w-4 h-4 ml-1" />
                                        ))}
                                </Button>
                            </th>
                            <th className="px-6 py-4 text-left">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleSort("fecha")}
                                    className="font-medium text-gray-700 hover:text-gray-900 cursor-pointer"
                                >
                                    Fecha
                                    {sortField === "fecha" &&
                                        (sortDirection === "asc" ? (
                                            <ChevronUp className="w-4 h-4 ml-1" />
                                        ) : (
                                            <ChevronDown className="w-4 h-4 ml-1" />
                                        ))}
                                </Button>
                            </th>
                            <th className="px-6 py-4 text-left">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleSort("cliente")}
                                    className="font-medium text-gray-700 hover:text-gray-900 cursor-pointer"
                                >
                                    Cliente
                                    {sortField === "cliente" &&
                                        (sortDirection === "asc" ? (
                                            <ChevronUp className="w-4 h-4 ml-1" />
                                        ) : (
                                            <ChevronDown className="w-4 h-4 ml-1" />
                                        ))}
                                </Button>
                            </th>
                            <th className="px-6 py-4 text-left">Aparato</th>
                            <th className="px-6 py-4 text-left">Teléfono</th>
                            <th className="px-6 py-4 text-left">Estado</th>
                            <th className="px-6 py-4 text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {sortedServices.map((service) => (
                            <tr key={service.noDeServicio} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="font-medium text-gray-900">
                                        #{highlightText(service.noDeServicio.toString(), searchQuery)}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center text-gray-700">
                                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                                        {formatDate(service.fecha)}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="font-medium text-gray-900">{highlightText(service.cliente, searchQuery)}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-gray-700">{highlightText(service.aparato, searchQuery)}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center text-gray-700">
                                        <Phone className="w-4 h-4 mr-2 text-gray-400" />
                                        <a href={`tel:${service.telefono}`} className="hover:text-blue-600 cursor-pointer">
                                            {highlightText(formatPhone(service.telefono), searchQuery)}
                                        </a>
                                    </div>
                                </td>
                                <td className="px-6 py-4">{getStatusBadge(service.estado)}</td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center justify-center space-x-2">
                                        <Link href={`/admin/servicios/${service.noDeServicio}`}   className="cursor-pointer">
                                            <Eye className="w-4 h-4" />
                                        </Link>
                                        <Link href={`/admin/servicios/nota/${service.noDeServicio}`} className="cursor-pointer">
                                            <Edit className="w-4 h-4" />
                                        </Link>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => onDeleteServiceAction(service)}
                                            className="text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden space-y-4 p-4">
                {sortedServices.map((service) => (
                    <div key={service.noDeServicio} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-3">
                                <div className="font-bold text-lg text-gray-900">
                                    #{highlightText(service.noDeServicio.toString(), searchQuery)}
                                </div>
                                {getStatusBadge(service.estado)}
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleRowExpansion(service.noDeServicio)}
                                className="cursor-pointer"
                            >
                                {expandedRows.has(service.noDeServicio) ? (
                                    <ChevronUp className="w-4 h-4" />
                                ) : (
                                    <ChevronDown className="w-4 h-4" />
                                )}
                            </Button>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="font-medium text-gray-900">{highlightText(service.cliente, searchQuery)}</span>
                                <span className="text-sm text-gray-500">{formatDate(service.fecha)}</span>
                            </div>

                            <div className="text-gray-700">{highlightText(service.aparato, searchQuery)}</div>

                            <div className="flex items-center text-gray-600">
                                <Phone className="w-4 h-4 mr-2" />
                                <a href={`tel:${service.telefono}`} className="hover:text-blue-600 cursor-pointer">
                                    {highlightText(formatPhone(service.telefono), searchQuery)}
                                </a>
                            </div>
                        </div>

                        {expandedRows.has(service.noDeServicio) && (
                            <div className="mt-4 pt-4 border-t border-gray-100">
                                <div className="space-y-3">
                                    <div>
                                        <span className="text-sm font-medium text-gray-500">Observaciones:</span>
                                        <p className="text-gray-700 mt-1">{service.observaciones}</p>
                                    </div>

                                    <div className="flex space-x-2">
                                        <Link href={`/admin/servicios/${service.noDeServicio}`} className="flex-1 cursor-pointer bg-transparent">
                                            <Eye className="w-4 h-4 mr-2" />
                                            Ver
                                        </Link>
                                        <Link href={`/admin/servicios/nota/${service.noDeServicio}`}  className="flex-1 cursor-pointer bg-transparent">
                                            <Edit className="w-4 h-4 mr-2" />
                                            Editar
                                        </Link>
                                        <Button

                                            onClick={() => onDeleteServiceAction(service)}
                                            className="flex-1 text-red-600 border-red-200 hover:bg-red-50 cursor-pointer"
                                        >
                                            <Trash2 className="w-4 h-4 mr-2" />
                                            Eliminar
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Pagination */}
            <TablePagination />
        </div>
    )
}
