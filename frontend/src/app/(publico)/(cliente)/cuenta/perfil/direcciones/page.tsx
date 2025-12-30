import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { getDirecciones } from "@/api/user"
import { DireccionesList } from "@/components/usuario"

export const metadata: Metadata = {
    title: 'Mis Direcciones - Refaccionaria Vega',
    description: 'Gestiona tus direcciones de envío',
}

export default async function DireccionesPage() {
    try {
        const direcciones = await getDirecciones()

        return (
            <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
                <div className="max-w-7xl mx-auto">
                    <DireccionesList direcciones={direcciones} />
                </div>
            </div>
        )
    } catch (error) {
        console.error("Error loading direcciones:", error)
        redirect("/cuenta/perfil")
    }
}

