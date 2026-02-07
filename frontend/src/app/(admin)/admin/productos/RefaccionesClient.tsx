"use client"

import { useState, useMemo, useEffect } from "react"
import { Button } from "@/components/admin/ui/Button"
import { Modal } from "@/components/admin/ui/Modal"
import { useAdminTheme } from "@/components/admin/hooks/useAdminTheme"
import { Plus } from "lucide-react"
import type { Refaccion, Categoria, Proveedor } from "@/api/productos"
import { getAllRefacciones, getAllCategorias, getAllProveedores } from "@/api/productos"
import ProductosHeader from "@/components/admin/productos/ProductosHeader"
import RefaccionForm from "@/components/admin/productos/RefaccionForm"
import RefaccionesTable from "@/components/admin/productos/RefaccionesTable"
import RefaccionDrawer from "@/components/admin/productos/RefaccionDrawer"

interface RefaccionesClientProps {
    initialRefacciones: Refaccion[]
}

export default function RefaccionesClient({ initialRefacciones }: RefaccionesClientProps) {
    const { dark } = useAdminTheme()
    const [search, setSearch] = useState("")
    const [refacciones, setRefacciones] = useState<Refaccion[]>(initialRefacciones)
    const [loading, setLoading] = useState(false)
    
    // Datos para el formulario (carga lazy)
    const [categorias, setCategorias] = useState<Categoria[]>([])
    const [proveedores, setProveedores] = useState<Proveedor[]>([])
    const [loadingFormData, setLoadingFormData] = useState(false)
    
    // Modal states
    const [showModal, setShowModal] = useState(false)
    const [editingRefaccion, setEditingRefaccion] = useState<Refaccion | null>(null)
    
    // Drawer state
    const [selectedRefaccion, setSelectedRefaccion] = useState<Refaccion | null>(null)
    const [drawerOpen, setDrawerOpen] = useState(false)

    const filteredRefacciones = useMemo(() => {
        if (!search.trim()) return refacciones
        const q = search.toLowerCase()
        return refacciones.filter(r => 
            r.nombre.toLowerCase().includes(q) ||
            r.codigo_parte.toLowerCase().includes(q) ||
            r.marca.toLowerCase().includes(q) ||
            r.compatibilidad.toLowerCase().includes(q)
        )
    }, [refacciones, search])

    // Cargar categorías y proveedores solo cuando se abre el modal por primera vez
    useEffect(() => {
        if (showModal && categorias.length === 0 && !loadingFormData) {
            loadFormData()
        }
    }, [showModal, categorias.length, loadingFormData])

    const loadFormData = async () => {
        setLoadingFormData(true)
        try {
            const [categoriasData, proveedoresData] = await Promise.all([
                getAllCategorias(),
                getAllProveedores()
            ])
            setCategorias(categoriasData)
            setProveedores(proveedoresData)
        } catch (err) {
            console.error("Error loading form data:", err)
        } finally {
            setLoadingFormData(false)
        }
    }

    const loadData = async () => {
        setLoading(true)
        try {
            const data = await getAllRefacciones()
            setRefacciones(data)
        } catch (err) {
            console.error("Error loading refacciones:", err)
        } finally {
            setLoading(false)
        }
    }

    const handleOpenCreate = () => {
        setEditingRefaccion(null)
        setShowModal(true)
    }

    const handleEdit = (refaccion: Refaccion) => {
        setEditingRefaccion(refaccion)
        setShowModal(true)
    }

    const handleSuccess = () => {
        setShowModal(false)
        setEditingRefaccion(null)
        loadData()
    }

    const handleViewRefaccion = (refaccion: Refaccion) => {
        setSelectedRefaccion(refaccion)
        setDrawerOpen(true)
    }

    const handleEditFromDrawer = () => {
        setDrawerOpen(false)
        if (selectedRefaccion) {
            setEditingRefaccion(selectedRefaccion)
            setShowModal(true)
        }
    }

    return (
        <main className={`min-h-screen ${dark ? 'bg-slate-900' : 'bg-gray-50'}`}>
            <ProductosHeader
                title="Gestión de Productos"
                description="Administra marcas, categorías, proveedores y refacciones."
                searchPlaceholder="Buscar refacciones..."
                resultsCount={filteredRefacciones.length}
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
                    Nueva Refacción
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
                        <RefaccionesTable
                            refacciones={filteredRefacciones}
                            onEdit={handleEdit}
                            onView={handleViewRefaccion}
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
                    setEditingRefaccion(null)
                }}
                wide
            >
                <RefaccionForm
                    refaccion={editingRefaccion}
                    onSuccess={handleSuccess}
                    onCancel={() => setShowModal(false)}
                    categorias={categorias}
                    proveedores={proveedores}
                />
            </Modal>

            {/* Drawer */}
            <RefaccionDrawer
                refaccion={selectedRefaccion}
                open={drawerOpen}
                onClose={() => {
                    setDrawerOpen(false)
                    setSelectedRefaccion(null)
                }}
                onEdit={handleEditFromDrawer}
            />
        </main>
    )
}

