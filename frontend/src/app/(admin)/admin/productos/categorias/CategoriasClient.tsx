"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/admin/ui/Button"
import { Modal } from "@/components/admin/ui/Modal"
import { useAdminTheme } from "@/components/admin/hooks/useAdminTheme"
import { Plus } from "lucide-react"
import type { Categoria } from "@/api/productos"
import { getAllCategorias } from "@/api/productos"
import ProductosHeader from "@/components/admin/productos/ProductosHeader"
import CategoriaForm from "@/components/admin/productos/CategoriaForm"
import CategoriasTable from "@/components/admin/productos/CategoriasTable"

interface CategoriasClientProps {
    initialCategorias: Categoria[]
}

export default function CategoriasClient({ initialCategorias }: CategoriasClientProps) {
    const { dark } = useAdminTheme()
    const [search, setSearch] = useState("")
    const [categorias, setCategorias] = useState<Categoria[]>(initialCategorias)
    const [loading, setLoading] = useState(false)
    
    // Modal states
    const [showModal, setShowModal] = useState(false)
    const [editingCategoria, setEditingCategoria] = useState<Categoria | null>(null)

    const filteredCategorias = useMemo(() => {
        if (!search.trim()) return categorias
        const q = search.toLowerCase()
        return categorias.filter(c => 
            c.nombre.toLowerCase().includes(q) ||
            c.descripcion?.toLowerCase().includes(q)
        )
    }, [categorias, search])

    const loadData = async () => {
        setLoading(true)
        try {
            const data = await getAllCategorias()
            setCategorias(data)
        } catch (err) {
            console.error("Error loading categorias:", err)
        } finally {
            setLoading(false)
        }
    }

    const handleOpenCreate = () => {
        setEditingCategoria(null)
        setShowModal(true)
    }

    const handleEdit = (categoria: Categoria) => {
        setEditingCategoria(categoria)
        setShowModal(true)
    }

    const handleSuccess = () => {
        setShowModal(false)
        setEditingCategoria(null)
        loadData()
    }

    return (
        <main className={`min-h-screen ${dark ? 'bg-slate-900' : 'bg-gray-50'}`}>
            <ProductosHeader
                title="Gestión de Productos"
                description="Administra marcas, categorías, proveedores y refacciones."
                searchPlaceholder="Buscar categorías..."
                resultsCount={filteredCategorias.length}
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
                    Nueva Categoría
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
                        <CategoriasTable
                            categorias={filteredCategorias}
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
                    setEditingCategoria(null)
                }}
            >
                <CategoriaForm
                    categoria={editingCategoria}
                    onSuccessAction={handleSuccess}
                    onCancelAction={() => setShowModal(false)}
                />
            </Modal>
        </main>
    )
}

