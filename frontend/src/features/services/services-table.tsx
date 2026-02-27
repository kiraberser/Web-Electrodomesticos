"use client"

import { useState } from "react"
import { Edit, Trash2, Phone, Calendar, Package, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/shared/ui/forms/Button"
import Link from "next/link"
import Pagination from "@/shared/ui/navigation/Pagination"
import type { AdminServicePageItem as Service, PaginationInfo } from "@/shared/types/service"
import { useAdminTheme } from "@/features/admin/hooks/useAdminTheme"
import { useRouter } from "next/navigation"

interface ServicesTableProps {
    services: Service[]
    loading: boolean
    onDeleteServiceAction: (service: Service) => void
    pagination: PaginationInfo
    onPageChangeAction: (page: number) => void
    onStatusChangeAction: (id: number, estado: string) => void
    onRevisionChangeAction: (id: number, estadoPago: string) => void
}

function colorEstado(estado: string, dark: boolean) {
    const map: Record<string, string> = {
        "Pendiente":  dark ? "bg-amber-900/20 text-amber-300"   : "bg-yellow-100 text-yellow-800",
        "En Proceso": dark ? "bg-blue-900/20 text-blue-300"     : "bg-blue-100 text-blue-800",
        "Reparado":   dark ? "bg-green-900/20 text-green-300"   : "bg-green-100 text-green-800",
        "Entregado":  dark ? "bg-purple-900/20 text-purple-300" : "bg-purple-100 text-purple-800",
        "Cancelado":  dark ? "bg-red-900/20 text-red-300"       : "bg-red-100 text-red-800",
    }
    return map[estado] ?? (dark ? "bg-gray-800 text-gray-400" : "bg-gray-100 text-gray-500")
}

function colorRevision(rev: string | undefined, dark: boolean) {
    if (rev === "Pagado")    return dark ? "bg-green-900/20 text-green-300"  : "bg-green-100 text-green-800"
    if (rev === "Pendiente") return dark ? "bg-amber-900/20 text-amber-300"  : "bg-yellow-100 text-yellow-800"
    return dark ? "bg-gray-800 text-gray-400" : "bg-gray-100 text-gray-500"
}

export default function ServicesTable({
    services,
    loading,
    onDeleteServiceAction,
    pagination,
    onPageChangeAction,
    onStatusChangeAction,
    onRevisionChangeAction,
}: ServicesTableProps) {
    const { dark } = useAdminTheme()
    const router = useRouter()
    const [sortField, setSortField] = useState<keyof Service>("noDeServicio")
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
    const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set())

    const sortedServices = [...services].sort((a, b) => {
        const aValue = a[sortField] ?? ""
        const bValue = b[sortField] ?? ""
        if (sortDirection === "asc") return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
    })

    const { count, currentPage, totalPages, pageSize } = pagination

    const handleSort = (field: keyof Service) => {
        if (sortField === field) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc")
        } else {
            setSortField(field)
            setSortDirection("asc")
        }
        onPageChangeAction(1)
    }

    const toggleRowExpansion = (serviceId: number) => {
        const next = new Set(expandedRows)
        next.has(serviceId) ? next.delete(serviceId) : next.add(serviceId)
        setExpandedRows(next)
    }

    const formatDate = (dateString: string) =>
        new Date(dateString).toLocaleDateString("es-MX", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        })

    const formatPhone = (phone: string) => {
        if (phone.length === 10) {
            return `(${phone.slice(0, 3)}) ${phone.slice(3, 6)}-${phone.slice(6)}`
        }
        return phone
    }

    const SortButton = ({ field, label }: { field: keyof Service; label: string }) => (
        <Button
            variant="ghost"
            size="sm"
            onClick={() => handleSort(field)}
            className={`font-medium cursor-pointer bg-transparent ${dark ? "text-gray-300 hover:text-gray-100" : "text-gray-700 hover:text-gray-900"}`}
        >
            {label}
            {sortField === field && (
                sortDirection === "asc"
                    ? <ChevronUp className="w-4 h-4 ml-1" />
                    : <ChevronDown className="w-4 h-4 ml-1" />
            )}
        </Button>
    )

    if (loading) {
        return (
            <div className="p-8">
                <div className="animate-pulse space-y-4">
                    <div className={`h-4 rounded w-1/4 ${dark ? "bg-white/10" : "bg-gray-200"}`}></div>
                    <div className="space-y-3">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className={`h-12 rounded ${dark ? "bg-white/10" : "bg-gray-200"}`}></div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    if (services.length === 0) {
        return (
            <div className="p-8 text-center">
                <Package className={`w-12 h-12 mx-auto mb-4 ${dark ? "text-gray-400" : "text-gray-500"}`} />
                <h3 className={`text-lg font-medium mb-2 ${dark ? "text-gray-100" : "text-gray-900"}`}>No hay servicios</h3>
                <p className={`${dark ? "text-gray-400" : "text-gray-600"}`}>
                    No se encontraron servicios con los filtros aplicados.
                </p>
            </div>
        )
    }

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
            onPageChange={onPageChangeAction}
            hrefForPage={hrefForPage}
        />
    )

    return (
        <div className={`${dark ? "text-gray-200" : "text-gray-700"} overflow-hidden`}>
            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                    <thead className={`${dark ? "bg-transparent border-b border-white/10" : "bg-gray-50 border-b border-gray-200"}`}>
                        <tr>
                            <th className="px-4 py-4 text-left"><SortButton field="noDeServicio" label="No. Servicio" /></th>
                            <th className="px-4 py-4 text-left"><SortButton field="fecha" label="Fecha" /></th>
                            <th className="px-4 py-4 text-left"><SortButton field="cliente" label="Cliente" /></th>
                            <th className="px-4 py-4 text-left">
                                <span className={`text-sm font-medium ${dark ? "text-gray-300" : "text-gray-700"}`}>Aparato</span>
                            </th>
                            <th className="px-4 py-4 text-left">
                                <span className={`text-sm font-medium ${dark ? "text-gray-300" : "text-gray-700"}`}>Teléfono</span>
                            </th>
                            <th className="px-4 py-4 text-left">
                                <span className={`text-sm font-medium ${dark ? "text-gray-300" : "text-gray-700"}`}>Estado</span>
                            </th>
                            <th className="px-4 py-4 text-left">
                                <span className={`text-sm font-medium ${dark ? "text-gray-300" : "text-gray-700"}`}>Revisión</span>
                            </th>
                            <th className="px-4 py-4 text-center">
                                <span className={`text-sm font-medium ${dark ? "text-gray-300" : "text-gray-700"}`}>Acciones</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody className={`${dark ? "divide-y divide-white/10" : "divide-y divide-gray-200"}`}>
                        {sortedServices.map((service) => (
                            <tr
                                key={service.noDeServicio}
                                onClick={() => router.push(`/admin/servicios/${service.noDeServicio}`)}
                                className={`cursor-pointer transition-colors ${dark ? "hover:bg-white/5" : "hover:bg-gray-50"}`}
                            >
                                <td className="px-4 py-3">
                                    <div className={`font-medium ${dark ? "text-gray-100" : "text-gray-900"}`}>
                                        #{service.noDeServicio}
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    <div className={`flex items-center ${dark ? "text-gray-300" : "text-gray-700"}`}>
                                        <Calendar className={`w-4 h-4 mr-2 ${dark ? "text-gray-400" : "text-gray-400"}`} />
                                        {formatDate(service.fecha)}
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    <div className={`font-medium ${dark ? "text-gray-100" : "text-gray-900"}`}>
                                        {service.cliente}
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    <div className={`${dark ? "text-gray-300" : "text-gray-700"}`}>{service.aparato}</div>
                                </td>
                                <td className="px-4 py-3">
                                    <div className={`flex items-center ${dark ? "text-gray-300" : "text-gray-700"}`}>
                                        <Phone className="w-4 h-4 mr-2 text-gray-400" />
                                        <a
                                            href={`tel:${service.telefono}`}
                                            onClick={e => e.stopPropagation()}
                                            className={`cursor-pointer ${dark ? "hover:text-blue-300" : "hover:text-blue-600"}`}
                                        >
                                            {formatPhone(service.telefono)}
                                        </a>
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    <select
                                        value={service.estado}
                                        onChange={e => onStatusChangeAction(service.noDeServicio, e.target.value)}
                                        onClick={e => e.stopPropagation()}
                                        className={`rounded-full px-2 py-1 text-xs font-medium border-0 cursor-pointer ${colorEstado(service.estado, dark)}`}
                                    >
                                        {["Pendiente", "En Proceso", "Reparado", "Entregado", "Cancelado"].map(e => (
                                            <option key={e} value={e}>{e}</option>
                                        ))}
                                    </select>
                                </td>
                                <td className="px-4 py-3">
                                    <select
                                        value={service.estadoPago ?? "No Aplica"}
                                        onChange={e => onRevisionChangeAction(service.noDeServicio, e.target.value)}
                                        onClick={e => e.stopPropagation()}
                                        className={`rounded-full px-2 py-1 text-xs font-medium border-0 cursor-pointer ${colorRevision(service.estadoPago, dark)}`}
                                    >
                                        {["Pendiente", "Pagado", "No Aplica"].map(r => (
                                            <option key={r} value={r}>{r}</option>
                                        ))}
                                    </select>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center justify-center space-x-2">
                                        <Link
                                            href={`/admin/servicios/nota/${service.noDeServicio}`}
                                            onClick={e => e.stopPropagation()}
                                            className={`cursor-pointer p-1 rounded ${dark ? "text-gray-400 hover:text-gray-200 hover:bg-white/10" : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"}`}
                                        >
                                            <Edit className="w-4 h-4" />
                                        </Link>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={e => { e.stopPropagation(); onDeleteServiceAction(service) }}
                                            className={`${dark ? "text-red-300 hover:bg-red-900/20" : "text-red-600 hover:text-red-700 hover:bg-red-50"} cursor-pointer`}
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
                    <div
                        key={service.noDeServicio}
                        onClick={() => router.push(`/admin/servicios/${service.noDeServicio}`)}
                        className={`rounded-lg p-4 shadow-sm cursor-pointer ${dark ? "border border-white/10 bg-[#0F172A] shadow-black/20 hover:bg-white/5" : "bg-white border border-gray-200 hover:bg-gray-50"}`}
                    >
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-3">
                                <div className={`font-bold text-lg ${dark ? "text-gray-100" : "text-gray-900"}`}>
                                    #{service.noDeServicio}
                                </div>
                                <span className={`rounded-full px-2 py-1 text-xs font-medium ${colorEstado(service.estado, dark)}`}>
                                    {service.estado}
                                </span>
                                {service.estadoPago && service.estadoPago !== "No Aplica" && (
                                    <span className={`rounded-full px-2 py-1 text-xs font-medium ${colorRevision(service.estadoPago, dark)}`}>
                                        {service.estadoPago}
                                    </span>
                                )}
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={e => { e.stopPropagation(); toggleRowExpansion(service.noDeServicio) }}
                                className="cursor-pointer"
                            >
                                {expandedRows.has(service.noDeServicio)
                                    ? <ChevronUp className="w-4 h-4" />
                                    : <ChevronDown className="w-4 h-4" />
                                }
                            </Button>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className={`font-medium ${dark ? "text-gray-100" : "text-gray-900"}`}>{service.cliente}</span>
                                <span className={`text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}>{formatDate(service.fecha)}</span>
                            </div>
                            <div className={`${dark ? "text-gray-300" : "text-gray-700"}`}>{service.aparato}</div>
                            <div className={`flex items-center ${dark ? "text-gray-400" : "text-gray-600"}`}>
                                <Phone className="w-4 h-4 mr-2" />
                                <a
                                    href={`tel:${service.telefono}`}
                                    onClick={e => e.stopPropagation()}
                                    className={`cursor-pointer ${dark ? "hover:text-blue-300" : "hover:text-blue-600"}`}
                                >
                                    {formatPhone(service.telefono)}
                                </a>
                            </div>
                        </div>

                        {expandedRows.has(service.noDeServicio) && (
                            <div
                                onClick={e => e.stopPropagation()}
                                className={`mt-4 pt-4 border-t ${dark ? "border-white/10" : "border-gray-100"}`}
                            >
                                {service.observaciones && (
                                    <div className="mb-3">
                                        <span className={`text-sm font-medium ${dark ? "text-gray-400" : "text-gray-500"}`}>Observaciones:</span>
                                        <p className={`${dark ? "text-gray-300" : "text-gray-700"} mt-1`}>{service.observaciones}</p>
                                    </div>
                                )}
                                <div className="flex space-x-2">
                                    <Link
                                        href={`/admin/servicios/nota/${service.noDeServicio}`}
                                        className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded text-sm ${dark ? "bg-white/5 text-gray-300 hover:bg-white/10" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                                    >
                                        <Edit className="w-4 h-4" />
                                        Editar
                                    </Link>
                                    <Button
                                        onClick={() => onDeleteServiceAction(service)}
                                        className={`flex-1 cursor-pointer ${dark ? "text-red-300 border-red-900/30 hover:bg-red-900/20" : "text-red-600 border-red-200 hover:bg-red-50"}`}
                                    >
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Eliminar
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <TablePagination />
        </div>
    )
}
