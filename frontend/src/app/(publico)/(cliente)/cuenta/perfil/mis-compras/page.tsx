import type { Metadata } from "next"

export const metadata: Metadata = {
    title: 'Mis Compras - Refaccionaria Vega',
    description: 'Historial de tus compras',
}

export default function MisComprasPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">Mis Compras</h1>
                
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <p className="text-gray-600 text-center py-8">
                        Aquí podrás ver el historial de todas tus compras realizadas.
                    </p>
                </div>
            </div>
        </div>
    )
}

