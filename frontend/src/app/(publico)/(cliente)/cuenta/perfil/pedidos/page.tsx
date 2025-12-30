import type { Metadata } from "next"

export const metadata: Metadata = {
    title: 'Mis Pedidos - Refaccionaria Vega',
    description: 'Gestiona tus pedidos',
}

export default function PedidosPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">Mis Pedidos</h1>
                
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <p className="text-gray-600 text-center py-8">
                        Aquí podrás ver y gestionar todos tus pedidos.
                    </p>
                </div>
            </div>
        </div>
    )
}

