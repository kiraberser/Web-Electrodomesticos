import type { Metadata } from 'next'

export const metadata: Metadata = { robots: 'noindex, nofollow' }

export default function ShippingReturnsPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Envíos y Devoluciones</h1>
            <p>Contenido de envíos y devoluciones pendiente</p>
        </div>
    );
}

