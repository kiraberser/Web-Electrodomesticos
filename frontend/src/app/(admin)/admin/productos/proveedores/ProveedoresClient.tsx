"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/admin/ui"
import { Modal } from "@/components/admin/ui/Modal"
import { useAdminTheme } from "@/components/admin/hooks/useAdminTheme"
import { Plus } from "lucide-react"
import type { Proveedor } from "@/api/productos"
import { getAllProveedores } from "@/api/productos"
import ProductosHeader from "@/components/admin/productos/ProductosHeader"
import ProveedorForm from "@/components/admin/productos/ProveedorForm"
import ProveedoresTable from "@/components/admin/productos/ProveedoresTable"

interface ProveedoresClientProps {
    initialProveedores: Proveedor[]
}

export default function ProveedoresClient({ initialProveedores }: ProveedoresClientProps) {
    const { dark } = useAdminTheme()
    const [search, setSearch] = useState("")
    const [proveedores, setProveedores] = useState<Proveedor[]>(initialProveedores)
    const [loading, setLoading] = useState(false)
    
    // Modal states
    const [showModal, setShowModal] = useState(false)
    const [editingProveedor, setEditingProveedor] = useState<Proveedor | null>(null)

    const filteredProveedores = useMemo(() => {
        if (!search.trim()) return proveedores
        const q = search.toLowerCase()
        return proveedores.filter(p => 
            p.nombre.toLowerCase().includes(q) ||
            p.contacto.toLowerCase().includes(q) ||
            p.correo_electronico.toLowerCase().includes(q)
        )
    }, [proveedores, search])

    const loadData = async () => {
        setLoading(true)
        try {
            const data = await getAllProveedores()
            setProveedores(data)
        } catch (err) {
            console.error("Error loading proveedores:", err)
        } finally {
            setLoading(false)
        }
    }

    const handleOpenCreate = () => {
        setEditingProveedor(null)
        setShowModal(true)
    }

    const handleEdit = (proveedor: Proveedor) => {
        setEditingProveedor(proveedor)
        setShowModal(true)
    }

    const handleSuccess = () => {
        setShowModal(false)
        setEditingProveedor(null)
        loadData()
    }

    return (
        <main className={`min-h-screen ${dark ? 'bg-slate-900' : 'bg-gray-50'}`}>
            <ProductosHeader
                title="Gestión de Productos"
                description="Administra marcas, categorías, proveedores y refacciones."
                searchPlaceholder="Buscar proveedores..."
                resultsCount={filteredProveedores.length}
                onSearchChange={setSearch}
                searchValue={search}
            />

            {/* Action Button */}
            <section className="w-full mx-auto px-4 md:px-6 lg:px-8 pb-4">
                <Button 
                    onClick={handleOpenCreate}
                    className="bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Nuevo Proveedor
                </Button>
            </section>

            {/* Content */}
            <section className="w-full mx-auto px-4 md:px-6 lg:px-8 pb-6">
                <div className={`overflow-hidden rounded-xl border ${dark ? 'border-slate-800 bg-slate-900' : 'border-gray-200 bg-white'}`}>
                    {loading ? (
                        <div className="p-10 text-center">
                            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
                            <p className={`mt-3 ${dark ? 'text-slate-400' : 'text-gray-600'}`}>Cargando...</p>
                        </div>
                    ) : (
                        <ProveedoresTable
                            proveedores={filteredProveedores}
                            onEdit={handleEdit}
                            onDataChange={loadData}
                        />
                    )}
                </div>
            </section>

            {/* Modal */}
            <Modal
                open={showModal}
                onClose={() => {
                    setShowModal(false)
                    setEditingProveedor(null)
                }}
                wide
            >
                <ProveedorForm
                    proveedor={editingProveedor}
                    onSuccess={handleSuccess}
                    onCancel={() => setShowModal(false)}
                />
            </Modal>
        </main>
    )
}

