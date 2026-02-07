"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/admin/ui/Button"
import { Modal } from "@/components/admin/ui/Modal"
import { useAdminTheme } from "@/components/admin/hooks/useAdminTheme"
import { Plus } from "lucide-react"
import type { Marca } from "@/api/productos"
import { getAllMarcas } from "@/api/productos"
import ProductosHeader from "@/components/admin/productos/ProductosHeader"
import MarcaForm from "@/components/admin/productos/MarcaForm"
import MarcasTable from "@/components/admin/productos/MarcasTable"

interface MarcasClientProps {
    initialMarcas: Marca[]
}

export default function MarcasClient({ initialMarcas }: MarcasClientProps) {
    const { dark } = useAdminTheme()
    const [search, setSearch] = useState("")
    const [marcas, setMarcas] = useState<Marca[]>(initialMarcas)
    const [loading, setLoading] = useState(false)
    
    // Modal states
    const [showModal, setShowModal] = useState(false)
    const [editingMarca, setEditingMarca] = useState<Marca | null>(null)

    const filteredMarcas = useMemo(() => {
        if (!search.trim()) return marcas
        const q = search.toLowerCase()
        return marcas.filter(m => 
            m.nombre.toLowerCase().includes(q) ||
            m.pais_origen?.toLowerCase().includes(q)
        )
    }, [marcas, search])

    const loadData = async () => {
        setLoading(true)
        try {
            const data = await getAllMarcas()
            setMarcas(data)
        } catch (err) {
            console.error("Error loading marcas:", err)
        } finally {
            setLoading(false)
        }
    }

    const handleOpenCreate = () => {
        setEditingMarca(null)
        setShowModal(true)
    }

    const handleEdit = (marca: Marca) => {
        setEditingMarca(marca)
        setShowModal(true)
    }

    const handleSuccess = () => {
        setShowModal(false)
        setEditingMarca(null)
        loadData()
    }

    return (
        <main className={`min-h-screen ${dark ? 'bg-slate-900' : 'bg-gray-50'}`}>
            <ProductosHeader
                title="Gestión de Productos"
                description="Administra marcas, categorías, proveedores y refacciones."
                searchPlaceholder="Buscar marcas..."
                resultsCount={filteredMarcas.length}
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
                    Nueva Marca
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
                        <MarcasTable
                            marcas={filteredMarcas}
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
                    setEditingMarca(null)
                }}
            >
                <MarcaForm
                    marca={editingMarca}
                    onSuccess={handleSuccess}
                    onCancel={() => setShowModal(false)}
                />
            </Modal>
        </main>
    )
}

